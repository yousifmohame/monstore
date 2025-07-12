// Mock data for the frontend
export const mockCategories = [
  {
    id: '1',
    nameAr: 'الملابس',
    name: 'Clothes',
    slug: 'clothes',
    description: 'T-shirts, hoodies and clothing with anime and manga designs',
    descriptionAr: 'تيشيرتات وهوديز وملابس بتصاميم الأنمي والمانجا',
    imageUrl: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=600',
    sortOrder: 1,
    isActive: true,
    _count: { products: 25 }
  },
  {
    id: '2',
    nameAr: 'الحقائب',
    name: 'Backpacks',
    slug: 'backpacks',
    description: 'Backpacks and school bags with anime character designs',
    descriptionAr: 'حقائب ظهر وحقائب مدرسية بتصاميم شخصيات الأنمي والمانجا',
    imageUrl: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=600',
    sortOrder: 2,
    isActive: true,
    _count: { products: 15 }
  },
  {
    id: '3',
    nameAr: 'أغطية الهواتف',
    name: 'Phone Cases',
    slug: 'phone-cases',
    description: 'Protective phone cases with amazing anime and manga designs',
    descriptionAr: 'أغطية حماية للهواتف الذكية بتصاميم أنمي ومانجا مذهلة',
    imageUrl: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=600',
    sortOrder: 3,
    isActive: true,
    _count: { products: 30 }
  },
  {
    id: '4',
    nameAr: 'التماثيل',
    name: 'Figurines',
    slug: 'figurines',
    description: 'High-quality collectible figurines of beloved anime and manga characters',
    descriptionAr: 'تماثيل مجمعة عالية الجودة لشخصيات الأنمي والمانجا المحبوبة',
    imageUrl: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=600',
    sortOrder: 4,
    isActive: true,
    _count: { products: 12 }
  },
  {
    id: '5',
    nameAr: 'الألعاب',
    name: 'Toys',
    slug: 'toys',
    description: 'Fun toys and collectibles from the anime and manga world',
    descriptionAr: 'ألعاب وقطع مجمعة ممتعة من عالم الأنمي والمانجا',
    imageUrl: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=600',
    sortOrder: 5,
    isActive: true,
    _count: { products: 18 }
  },
  {
    id: '6',
    nameAr: 'الإكسسوارات',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Various accessories from jewelry to keychains and more',
    descriptionAr: 'إكسسوارات متنوعة من مجوهرات وسلاسل مفاتيح وأكثر',
    imageUrl: 'https://images.pexels.com/photos/1070941/pexels-photo-1070941.jpeg?auto=compress&cs=tinysrgb&w=600',
    sortOrder: 6,
    isActive: true,
    _count: { products: 22 }
  }
];

// Define color and size options
export const colorOptions = [
  { id: '1', nameAr: 'أسود', name: 'Black', value: '#000000' },
  { id: '2', nameAr: 'أبيض', name: 'White', value: '#FFFFFF' },
  { id: '3', nameAr: 'أحمر', name: 'Red', value: '#FF0000' },
  { id: '4', nameAr: 'أزرق', name: 'Blue', value: '#0000FF' },
  { id: '5', nameAr: 'أخضر', name: 'Green', value: '#00FF00' },
  { id: '6', nameAr: 'أصفر', name: 'Yellow', value: '#FFFF00' },
  { id: '7', nameAr: 'رمادي', name: 'Gray', value: '#808080' },
  { id: '8', nameAr: 'بنفسجي', name: 'Purple', value: '#800080' },
  { id: '9', nameAr: 'برتقالي', name: 'Orange', value: '#FFA500' },
  { id: '10', nameAr: 'وردي', name: 'Pink', value: '#FFC0CB' }
];

export const sizeOptions = [
  { id: '1', nameAr: 'صغير جداً', name: 'XS', value: 'XS' },
  { id: '2', nameAr: 'صغير', name: 'S', value: 'S' },
  { id: '3', nameAr: 'متوسط', name: 'M', value: 'M' },
  { id: '4', nameAr: 'كبير', name: 'L', value: 'L' },
  { id: '5', nameAr: 'كبير جداً', name: 'XL', value: 'XL' },
  { id: '6', nameAr: 'كبير جداً جداً', name: 'XXL', value: 'XXL' },
  { id: '7', nameAr: '35', name: '35', value: '35' },
  { id: '8', nameAr: '36', name: '36', value: '36' },
  { id: '9', nameAr: '37', name: '37', value: '37' },
  { id: '10', nameAr: '38', name: '38', value: '38' },
  { id: '11', nameAr: '39', name: '39', value: '39' },
  { id: '12', nameAr: '40', name: '40', value: '40' },
  { id: '13', nameAr: '41', name: '41', value: '41' },
  { id: '14', nameAr: '42', name: '42', value: '42' },
  { id: '15', nameAr: '43', name: '43', value: '43' },
  { id: '16', nameAr: '44', name: '44', value: '44' },
  { id: '17', nameAr: '45', name: '45', value: '45' },
  { id: '18', nameAr: 'موحد', name: 'One Size', value: 'ONE_SIZE' }
];

export const mockProducts = [
  {
    id: '1',
    nameAr: 'تيشيرت ناروتو الأصلي',
    name: 'Original Naruto T-Shirt',
    descriptionAr: 'تيشيرت ناروتو عالي الجودة بتصميم أصلي من المانجا',
    description: 'High quality Naruto t-shirt with original manga design',
    slug: 'naruto-tshirt-original',
    price: 89.99,
    salePrice: 69.99,
    sku: 'NAR-TSH-001',
    stock: 25,
    categoryId: '1',
    rating: 4.8,
    reviewsCount: 124,
    tags: ['naruto', 'tshirt', 'anime', 'manga'],
    tagsAr: ['ناروتو', 'تيشيرت', 'أنمي', 'مانجا'],
    featured: true,
    newArrival: false,
    bestSeller: true,
    onSale: true,
    isActive: true,
    hasVariants: true,
    colors: ['1', '2', '4'], // Black, White, Blue
    sizes: ['2', '3', '4', '5'], // S, M, L, XL
    variants: [
      { id: '1-1', colorId: '1', sizeId: '2', stock: 5, sku: 'NAR-TSH-001-BLK-S' },
      { id: '1-2', colorId: '1', sizeId: '3', stock: 8, sku: 'NAR-TSH-001-BLK-M' },
      { id: '1-3', colorId: '1', sizeId: '4', stock: 7, sku: 'NAR-TSH-001-BLK-L' },
      { id: '1-4', colorId: '1', sizeId: '5', stock: 5, sku: 'NAR-TSH-001-BLK-XL' },
      { id: '1-5', colorId: '2', sizeId: '2', stock: 0, sku: 'NAR-TSH-001-WHT-S' },
      { id: '1-6', colorId: '2', sizeId: '3', stock: 3, sku: 'NAR-TSH-001-WHT-M' },
      { id: '1-7', colorId: '2', sizeId: '4', stock: 4, sku: 'NAR-TSH-001-WHT-L' },
      { id: '1-8', colorId: '2', sizeId: '5', stock: 2, sku: 'NAR-TSH-001-WHT-XL' },
      { id: '1-9', colorId: '4', sizeId: '2', stock: 1, sku: 'NAR-TSH-001-BLU-S' },
      { id: '1-10', colorId: '4', sizeId: '3', stock: 3, sku: 'NAR-TSH-001-BLU-M' },
      { id: '1-11', colorId: '4', sizeId: '4', stock: 2, sku: 'NAR-TSH-001-BLU-L' },
      { id: '1-12', colorId: '4', sizeId: '5', stock: 0, sku: 'NAR-TSH-001-BLU-XL' }
    ],
    images: [
      {
        imageUrl: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=400',
        altText: 'تيشيرت ناروتو الأصلي',
        sortOrder: 0,
        isPrimary: true
      }
    ],
    category: { nameAr: 'الملابس', name: 'Clothes' }
  },
  {
    id: '2',
    nameAr: 'حقيبة ظهر أتاك أون تايتان',
    name: 'Attack on Titan Backpack',
    descriptionAr: 'حقيبة ظهر متينة بتصميم أتاك أون تايتان من المانجا الشهيرة',
    description: 'Durable backpack with Attack on Titan design from the famous manga',
    slug: 'attack-on-titan-backpack',
    price: 199.99,
    salePrice: 149.99,
    sku: 'AOT-BAG-001',
    stock: 8,
    categoryId: '2',
    rating: 4.9,
    reviewsCount: 89,
    tags: ['attack-on-titan', 'backpack', 'school', 'manga'],
    tagsAr: ['أتاك-أون-تايتان', 'حقيبة-ظهر', 'مدرسة', 'مانجا'],
    featured: false,
    newArrival: true,
    bestSeller: true,
    onSale: true,
    isActive: true,
    hasVariants: true,
    colors: ['1', '4', '7'], // Black, Blue, Gray
    sizes: ['18'], // One Size
    variants: [
      { id: '2-1', colorId: '1', sizeId: '18', stock: 3, sku: 'AOT-BAG-001-BLK' },
      { id: '2-2', colorId: '4', sizeId: '18', stock: 2, sku: 'AOT-BAG-001-BLU' },
      { id: '2-3', colorId: '7', sizeId: '18', stock: 3, sku: 'AOT-BAG-001-GRY' }
    ],
    images: [
      {
        imageUrl: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400',
        altText: 'حقيبة ظهر أتاك أون تايتان',
        sortOrder: 0,
        isPrimary: true
      }
    ],
    category: { nameAr: 'الحقائب', name: 'Backpacks' }
  },
  {
    id: '3',
    nameAr: 'غطاء هاتف ديمون سلاير',
    name: 'Demon Slayer Phone Case',
    descriptionAr: 'غطاء هاتف واقي بشخصيات ديمون سلاير من الأنمي والمانجا',
    description: 'Protective phone case with Demon Slayer characters from anime and manga',
    slug: 'demon-slayer-phone-case',
    price: 49.99,
    sku: 'DS-CASE-001',
    stock: 20,
    categoryId: '3',
    rating: 4.7,
    reviewsCount: 156,
    tags: ['demon-slayer', 'phone-case', 'protection', 'anime', 'manga'],
    tagsAr: ['ديمون-سلاير', 'غطاء-هاتف', 'حماية', 'أنمي', 'مانجا'],
    featured: false,
    newArrival: false,
    bestSeller: true,
    onSale: false,
    isActive: true,
    hasVariants: true,
    colors: ['1', '2', '3', '4'], // Black, White, Red, Blue
    sizes: [], // No sizes for phone cases, but we could add phone models here
    variants: [
      { id: '3-1', colorId: '1', sizeId: null, stock: 5, sku: 'DS-CASE-001-BLK' },
      { id: '3-2', colorId: '2', sizeId: null, stock: 5, sku: 'DS-CASE-001-WHT' },
      { id: '3-3', colorId: '3', sizeId: null, stock: 5, sku: 'DS-CASE-001-RED' },
      { id: '3-4', colorId: '4', sizeId: null, stock: 5, sku: 'DS-CASE-001-BLU' }
    ],
    images: [
      {
        imageUrl: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=400',
        altText: 'غطاء هاتف ديمون سلاير',
        sortOrder: 0,
        isPrimary: true
      }
    ],
    category: { nameAr: 'أغطية الهواتف', name: 'Phone Cases' }
  },
  {
    id: '4',
    nameAr: 'تمثال غوكو الذهبي',
    name: 'Golden Goku Figurine',
    descriptionAr: 'تمثال غوكو الذهبي عالي الجودة من دراغون بول',
    description: 'High-quality golden Goku figurine from Dragon Ball',
    slug: 'golden-goku-figurine',
    price: 299.99,
    salePrice: 249.99,
    sku: 'DBZ-FIG-001',
    stock: 5,
    categoryId: '4',
    rating: 4.9,
    reviewsCount: 67,
    tags: ['dragon-ball', 'goku', 'figurine', 'collectible'],
    tagsAr: ['دراغون-بول', 'غوكو', 'تمثال', 'مجموعة'],
    featured: false,
    newArrival: true,
    bestSeller: false,
    onSale: true,
    isActive: true,
    hasVariants: false, // No variants for this product
    colors: [],
    sizes: [],
    variants: [],
    images: [
      {
        imageUrl: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400',
        altText: 'تمثال غوكو الذهبي',
        sortOrder: 0,
        isPrimary: true
      }
    ],
    category: { nameAr: 'التماثيل', name: 'Figurines' }
  },
  {
    id: '5',
    nameAr: 'لعبة بيكاتشو الطرية',
    name: 'Pikachu Plush Toy',
    descriptionAr: 'لعبة بيكاتشو الطرية والناعمة من بوكيمون',
    description: 'Soft and cuddly Pikachu plush toy from Pokemon',
    slug: 'pikachu-plush-toy',
    price: 79.99,
    sku: 'PKM-TOY-001',
    stock: 15,
    categoryId: '5',
    rating: 4.6,
    reviewsCount: 203,
    tags: ['pokemon', 'pikachu', 'plush', 'toy'],
    tagsAr: ['بوكيمون', 'بيكاتشو', 'طرية', 'لعبة'],
    featured: false,
    newArrival: true,
    bestSeller: true,
    onSale: false,
    isActive: true,
    hasVariants: true,
    colors: [],
    sizes: ['1', '18'], // XS, One Size
    variants: [
      { id: '5-1', colorId: null, sizeId: '1', stock: 5, sku: 'PKM-TOY-001-XS' },
      { id: '5-2', colorId: null, sizeId: '18', stock: 10, sku: 'PKM-TOY-001-OS' }
    ],
    images: [
      {
        imageUrl: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400',
        altText: 'لعبة بيكاتشو الطرية',
        sortOrder: 0,
        isPrimary: true
      }
    ],
    category: { nameAr: 'الألعاب', name: 'Toys' }
  },
  {
    id: '6',
    nameAr: 'سلسلة مفاتيح ون بيس',
    name: 'One Piece Keychain',
    descriptionAr: 'سلسلة مفاتيح بتصميم شخصيات ون بيس من المانجا الشهيرة',
    description: 'Keychain featuring One Piece characters from the famous manga',
    slug: 'one-piece-keychain',
    price: 29.99,
    sku: 'OP-KEY-001',
    stock: 50,
    categoryId: '6',
    rating: 4.4,
    reviewsCount: 89,
    tags: ['one-piece', 'keychain', 'accessories', 'manga'],
    tagsAr: ['ون-بيس', 'سلسلة-مفاتيح', 'إكسسوارات', 'مانجا'],
    featured: false,
    newArrival: false,
    bestSeller: true,
    onSale: false,
    isActive: true,
    hasVariants: false, // No variants for this product
    colors: [],
    sizes: [],
    variants: [],
    images: [
      {
        imageUrl: 'https://images.pexels.com/photos/1070941/pexels-photo-1070941.jpeg?auto=compress&cs=tinysrgb&w=400',
        altText: 'سلسلة مفاتيح ون بيس',
        sortOrder: 0,
        isPrimary: true
      }
    ],
    category: { nameAr: 'الإكسسوارات', name: 'Accessories' }
  }
];

export const mockSettings = {
  shippingCost: 25,
  taxRate: 0.15,
  currency: 'SAR',
  featuredBannerTitleAr: 'مرحباً بك في كيوتاكو',
  featuredBannerTitle: 'Welcome to Kyotaku',
  featuredBannerSubtitleAr: 'وجهتك الأولى لكل ما يخص الأنمي والمانجا. من الملابس والإكسسوارات إلى التماثيل والألعاب، اكتشف عالماً مليئاً بالإبداع والجودة.',
  featuredBannerSubtitle: 'Your first destination for everything anime and manga. From clothes and accessories to figurines and toys, discover a world full of creativity and quality.'
};

export const mockUsers = [
  {
    id: 'admin-1',
    email: 'admin@kyotaku.sa',
    fullName: 'مدير كيوتاكو',
    phone: '+966501234567',
    address: 'الرياض، المملكة العربية السعودية',
    city: 'الرياض',
    postalCode: '12345',
    isAdmin: true,
    profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user-1',
    email: 'user@kyotaku.sa',
    fullName: 'أحمد محمد',
    phone: '+966507654321',
    address: 'جدة، المملكة العربية السعودية',
    city: 'جدة',
    postalCode: '54321',
    isAdmin: false,
    profileImage: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockOrders = [
  {
    id: '1',
    userId: 'user-1',
    orderNumber: 'ORD-1703123456789',
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    paymentMethod: 'credit_card',
    subtotal: 219.98,
    taxAmount: 32.997,
    shippingAmount: 25,
    discountAmount: 20,
    totalAmount: 257.977,
    currency: 'SAR',
    shippingAddress: {
      fullName: 'أحمد محمد',
      address: 'جدة، المملكة العربية السعودية',
      city: 'جدة',
      postalCode: '54321',
      phone: '+966507654321'
    },
    trackingNumber: 'TRK123456789',
    trackingUrl: 'https://www.smsaexpress.com/ae/ar/node/18?tracking=TRK123456789',
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'Original Naruto T-Shirt',
        productNameAr: 'تيشيرت ناروتو الأصلي',
        productImage: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=400',
        quantity: 2,
        unitPrice: 69.99,
        totalPrice: 139.98,
        variantId: '1-2',
        color: 'أسود',
        size: 'M'
      },
      {
        id: '2',
        productId: '6',
        productName: 'One Piece Keychain',
        productNameAr: 'سلسلة مفاتيح ون بيس',
        productImage: 'https://images.pexels.com/photos/1070941/pexels-photo-1070941.jpeg?auto=compress&cs=tinysrgb&w=400',
        quantity: 1,
        unitPrice: 29.99,
        totalPrice: 29.99
      }
    ],
    shippedAt: new Date('2024-01-15').toISOString(),
    deliveredAt: new Date('2024-01-17').toISOString(),
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-17').toISOString()
  }
];