import { Component, OnInit } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  AbstractControl, 
  ValidationErrors,
  ReactiveFormsModule,
  FormsModule 
} from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product/product.service';

interface Variant {
  id: string;
  size: string;
  color: string;
  stock: number; // Only stock for inventory
  image?: string;
  imagePreview?: string;
  imageFile?: File;
}

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
  providers: [DecimalPipe],
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css'],
})

export class AddProduct implements OnInit {
  title = 'Add Product';
  categories = [
    { name: 'tops', types: ['graphic-tops', 'tube-tops', 'mesh-tops', 'crop-tops', 'corset-tops','casual-shirts','work-shirts'] },
    { name: 'sweaters', types: ['long-sleeves', 'sweaters', 'hoodies', 'cardigans'] },
    { name: 'bottoms', types: ['pants', 'skirts', 'shorts','jeans'] },
    { name: 'outwears', types: ['jackets', 'coats'] },
    { name: 'dresses', types: ['mini-dresses', 'midi-dresses', 'maxi-dresses', 'two-piece-sets'] },
    { name: 'shoes', types: ['sneakers', 'boots', 'cowboy-boots', 'sandals'] },
    { name: 'accessories', types: [] }
  ];

  dateOptions = ['Single Date', 'Custom Range'];
  
  // Variants options
  sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  shoeSizesWomen = ['36', '37', '38', '40'];
  shoeSizesMen = ['40', '41', '42', '43', '44', '45'];
  colorOptions = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Gray', 'Navy', 'Beige', 'Cream', 'Violet', 'Chestnut', 'Rose', 'Multicolor'];

  form!: FormGroup;
  variants: Variant[] = [];

  images: any[] = [];
  showFileInput = true;

  maxImages = 5;
  maxImagesError = false;

  submitted = false;
  successMessage = '';

  minDate: string = '';

  showPublishModal = false;

  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router) {}

  ngOnInit() {
    // Set minDate to today in YYYY-MM-DD format
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.minDate = `${yyyy}-${mm}-${dd}`;

    this.form = this.fb.group({
      productName: ['', Validators.required],
      gender: ['unisex'],
      category: [this.categories[0].name],
      type: [this.categories[0].types[0] || ''],
      regularPrice: ['', [Validators.required, this.floatNumberValidator, this.positiveNumberValidator]],
      salePrice: ['', [this.floatNumberOrEmptyValidator]],
      dateOption: [this.dateOptions[0]],
      date: [''],
      schedule: [''],
      description: ['', [Validators.required, Validators.minLength(10)]]
    }, { validators: [this.salePriceLessThanRegularPriceValidator, this.atLeastOneImageValidator.bind(this)] });

    // Enable/disable 'type' control based on available types
    const typeControl = this.form.get('type');
    const setTypeControlState = () => {
      const types = this.typesForSelectedCategory;
      if (types.length === 0) {
        typeControl?.disable();
      } else {
        typeControl?.enable();
      }
    };
    setTypeControlState();
    this.form.get('category')!.valueChanges.subscribe(() => {
      setTypeControlState();
    });

    // Dynamic validators
    this.form.get('dateOption')!.valueChanges.subscribe(option => {
      if (option === 'Single Date') {
        this.form.get('date')!.setValidators([Validators.required]);
        this.form.get('schedule')!.clearValidators();
        this.form.get('schedule')!.setValue('');
      } else if (option === 'Custom Range') {
        this.form.get('schedule')!.setValidators([Validators.required, this.dateRangeValidator]);
        this.form.get('date')!.clearValidators();
        this.form.get('date')!.setValue('');
      }
      this.form.get('date')!.updateValueAndValidity();
      this.form.get('schedule')!.updateValueAndValidity();
    });
  }

  get typesForSelectedCategory() {
    const found = this.categories.find(cat => cat.name === this.form?.get('category')?.value);
    return found ? found.types : [];
  }

  // Custom validator for float numbers
  floatNumberValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value === '' || control.value === null) return null;
    const value = Number(control.value);
    if (isNaN(value) || !/^\d*\.?\d+$/.test(control.value)) {
      return { float: true };
    }
    return null;
  }

  // Custom validator for float or empty (for salePrice)
  floatNumberOrEmptyValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value === '' || control.value === null) return null;
    const value = Number(control.value);
    if (isNaN(value) || !/^\d*\.?\d+$/.test(control.value)) {
      return { float: true };
    }
    return null;
  }

  // Custom validator for positive numbers
  positiveNumberValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value === '' || control.value === null) return null;
    const value = Number(control.value);
    if (isNaN(value) || value <= 0) {
      return { positive: true };
    }
    return null;
  }

  // Custom validator for salePrice < regularPrice
  salePriceLessThanRegularPriceValidator(group: AbstractControl): ValidationErrors | null {
    const regular = parseFloat(group.get('regularPrice')?.value);
    const sale = parseFloat(group.get('salePrice')?.value);
    if (!isNaN(sale) && !isNaN(regular) && sale >= regular) {
      return { saleNotLess: true };
    }
    return null;
  }

  // Custom validator for date range (format: MM/DD/YYYY - MM/DD/YYYY)
  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return { required: true };
    const parts = value.split('-').map((s: string) => s.trim());
    if (parts.length !== 2) return { invalidRange: true };
    const [start, end] = parts;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate > endDate) {
      return { invalidRange: true };
    }
    return null;
  }

  // Custom validator to ensure at least one image is uploaded
  atLeastOneImageValidator(group: AbstractControl): ValidationErrors | null {
    if (!this.images || this.images.length === 0) {
      return { noImage: true };
    }
    return null;
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    this.handleFiles(files);
    this.showFileInput = false;
    setTimeout(() => this.showFileInput = true, 0);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  handleFiles(files: FileList) {
    if (this.images.length >= this.maxImages) {
      this.maxImagesError = true;
      return;
    }
    let added = 0;
    Array.from(files).forEach(file => {
      // Check for duplicate by name and size
      const alreadyExists = this.images.some(img => img.name === file.name && img.size === Math.round(file.size / 1024));
      if (!alreadyExists && this.images.length < this.maxImages) {
        const reader = new FileReader();
        const imgObj: any = {
          name: file.name,
          size: Math.round(file.size / 1024),
          preview: '',
          progress: 0,
          uploadRef: null,
          file: file
        };
        reader.onload = (e: any) => {
          imgObj.preview = e.target.result;
          this.images.push(imgObj);
          this.simulateUpload(imgObj);
          this.form.updateValueAndValidity(); // update validity after adding image
        };
        reader.readAsDataURL(file);
        added++;
      }
    });
    this.maxImagesError = (this.images.length >= this.maxImages);
  }

  simulateUpload(imgObj: any) {
    let progress = 0;
    imgObj.uploadRef = setInterval(() => {
      if (progress >= 100) {
        clearInterval(imgObj.uploadRef);
        imgObj.progress = 100;
      } else {
        progress += 10;
        imgObj.progress = progress;
      }
    }, 200);
  }

  removeImage(index: number) {
    if (this.images[index].uploadRef) {
      clearInterval(this.images[index].uploadRef);
    }
    this.images.splice(index, 1);
    this.form.updateValueAndValidity(); // update validity after removing image
    this.maxImagesError = false;
  }

  cancelUpload(index: number) {
    this.removeImage(index);
  }

  triggerFileInput() {
    setTimeout(() => {
      const input = document.querySelector('input[type=file]') as HTMLElement;
      if (input) input.click();
    }, 0);
  }

  get publishInfo(): string {
    const dateOption = this.form.get('dateOption')?.value;
    const dateValue = this.form.get('date')?.value;
    const schedule = this.form.get('schedule')?.value;
    const today = new Date();
    if (dateOption === 'Single Date' && dateValue) {
      const selectedDate = new Date(dateValue);
      selectedDate.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
      if (selectedDate > today) {
        return `This product will be scheduled for ${selectedDate.toLocaleDateString()}.`;
      }
      return 'This product will be published immediately.';
    } else if (dateOption === 'Custom Range' && schedule) {
      return `This product will be visible from ${schedule}.`;
    }
    return 'This product will be published immediately.';
  }

  onSubmit(action: 'draft' | 'publish' = 'draft'): void {
    this.submitted = true;
    this.form.markAllAsTouched();

    if (this.form.invalid || !this.images.length) {
      return;
    }

    let status: 'draft' | 'published' | 'scheduled' = 'draft';

    if (action === 'publish') {
      const dateOption = this.form.get('dateOption')?.value;
      const today = new Date();
      let publishStatus: 'published' | 'scheduled' = 'published';

      if (dateOption === 'Single Date') {
        const dateValue = this.form.get('date')?.value;
        if (dateValue) {
          const selectedDate = new Date(dateValue);
          selectedDate.setHours(0,0,0,0);
          today.setHours(0,0,0,0);
          if (selectedDate > today) {
            publishStatus = 'scheduled';
          }
        }
      } else if (dateOption === 'Custom Range') {
        publishStatus = 'scheduled';
      }

      status = publishStatus;
    }

    // Build productData (same as before), but set computed status
    const productData: any = {
      name: this.form.get('productName')?.value,
      gender: this.form.get('gender')?.value,
      category: this.form.get('category')?.value,
      type: this.form.get('type')?.value,
      regularPrice: this.form.get('regularPrice')?.value,
      salePrice: this.form.get('salePrice')?.value,
      description: this.form.get('description')?.value,
      dateOption: this.form.get('dateOption')?.value,
      date: this.form.get('date')?.value,
      schedule: this.form.get('schedule')?.value,
      imageUrl: '', // optional if needed
      images: this.images.map(img => img.file).filter((f: File) => !!f),
      status: status, // <-- use computed status here
      variants: this.variants // Pass the full array with imageFile
    };

    // Add variant image files separately
    const variantImageFiles: File[] = [];
    this.variants.forEach(variant => {
      if (variant.imageFile) {
        variantImageFiles.push(variant.imageFile);
      }
    });
    if (variantImageFiles.length > 0) {
      productData.variantImageFiles = variantImageFiles;
    }

    this.productService.createProduct(productData).subscribe({
      next: (response) => {
        const actionMsg = status === 'draft' ? 'saved as draft' : (status === 'scheduled' ? 'scheduled' : 'published');
        this.successMessage = `Product ${actionMsg} successfully!`;
      },
      error: (err) => {
        this.successMessage = '';
        alert('Failed to create product.');
      }
    });
  }

  saveAsDraft(): void {
    this.onSubmit('draft');
  }

  publishProduct(): void {
    this.showPublishModal = true;
  }

  closePublishModal(): void {
    this.showPublishModal = false;
  }

  confirmPublish(): void {
    this.closePublishModal();
    this.onSubmit('publish');
  }

  // Variants management methods
  addVariant(): void {
    const defaultSize = this.getVariantSizeOptions()[0] || 'XS';
    this.variants.push({
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      size: defaultSize,
      color: 'Black',
      stock: 0, // Initialize stock to 0
      imagePreview: undefined,
    });
  }

  removeVariant(index: number): void {
    this.variants.splice(index, 1);
  }

  updateVariant(index: number, field: 'size' | 'color' | 'stock', value: string | number): void {
    if (this.variants[index]) {
      if (field === 'size' || field === 'color') {
        this.variants[index][field] = value as string;
      } else if (field === 'stock') {
        this.variants[index][field] = value as number;
      }
    }
  }

  onVariantImageSelected(event: any, variantIndex: number): void {
    const file = event.target.files[0];
    if (file && this.variants[variantIndex]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.variants[variantIndex].imagePreview = e.target.result;
        this.variants[variantIndex].imageFile = file;
      };
      reader.readAsDataURL(file);
    }
  }

  removeVariantImage(variantIndex: number): void {
    if (this.variants[variantIndex]) {
      this.variants[variantIndex].imagePreview = undefined;
      this.variants[variantIndex].imageFile = undefined;
    }
  }

  getTotalStock(): number {
    return this.variants.reduce((total, variant) => total + variant.stock, 0);
  }

  getVariantSizeOptions(): string[] {
    const gender = this.form.get('gender')?.value;
    const category = this.form.get('category')?.value;
    if (category === 'Shoes') {
      if (gender === 'women') {
        return this.shoeSizesWomen;
      } else if (gender === 'men') {
        return this.shoeSizesMen;
      } else if (gender === 'unisex') {
        // Combine both arrays and remove duplicates
        return Array.from(new Set([...this.shoeSizesWomen, ...this.shoeSizesMen]));
      }
    }
    return this.sizeOptions;
  }

  formatDisplayText(text: string): string {
    return text.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // Calculate stock status automatically
  calculateStockStatus(): string {
    if (this.variants.length === 0) {
      return 'Out of Stock';
    }
    const totalStock = this.getTotalStock();
    return totalStock > 0 ? 'In Stock' : 'Out of Stock';
  }

  // Check if any variant has stock
  hasAnyStock(): boolean {
    return this.variants.some(variant => variant.stock > 0);
  }
}