// ========== MAIN APPLICATION SCRIPT ==========
// Site kökü: index.php ve assets'ın bulunduğu dizin. app.js yüklendiği yoldan türetilir (assets/ üstü = kök).
// PHP ile override: header'da window.SITE_ROOT = '/yeppos' veya '' yazılabilir.

//localStorage.clear();
(function () {

    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
        var src = scripts[i].src;
        if (src && src.indexOf('app.js') !== -1) {
            try {
                var u = new URL(src);
                var path = u.pathname;
                window.__APP_BASE_PATH = path.replace(/\/assets\/.*$/i, '').replace(/\/$/, '') || '';
            } catch (e) { }
            break;
        }
    }
})();
function getSiteRoot() {
    if (typeof window.SITE_ROOT !== 'undefined' && window.SITE_ROOT !== null && window.SITE_ROOT !== '') {
        return String(window.SITE_ROOT).replace(/\/$/, '');
    }
    if (typeof window.__APP_BASE_PATH !== 'undefined' && window.__APP_BASE_PATH !== '') {
        return window.__APP_BASE_PATH;
    }
    return '';
}
window.getSiteRoot = getSiteRoot;

function isTahmisciBackendCatalogMode() {
    return document.body?.classList.contains('tahmisci-static-menu') === true;
}
window.isTahmisciBackendCatalogMode = isTahmisciBackendCatalogMode;

// AJAX çağrılarında kullanılacak dil (JSON diline göre veri dönmek için)
function getAjaxLang() {
    return (window.I18N && typeof window.I18N.getPreferredLanguage === 'function' && window.I18N.getPreferredLanguage()) || localStorage.getItem('site_language') || 'tr';
}
window.getAjaxLang = getAjaxLang;

// Üye ol / sipariş için şube id: URL > localStorage > 48
function getRegisterCompanyId() {
    const p = new URLSearchParams(window.location.search);
    const fromUrl = p.get('company_id');
    if (fromUrl) return parseInt(fromUrl, 10) || 48;
    const fromStorage = localStorage.getItem('menuBranchId') || localStorage.getItem('menuCompanyId');
    if (fromStorage) return parseInt(fromStorage, 10) || 48;
    return 48;
}
window.getRegisterCompanyId = getRegisterCompanyId;

// AJAX çağrılarında dil parametresi (JSON diline göre veri dönmek için)
function getApiLang() {
    return window.I18N?.getPreferredLanguage?.() || localStorage.getItem('site_language') || 'tr';
}
window.getApiLang = getApiLang;

class YepPosApp {
    constructor() {
        this.isLoaded = false;
        this.currentUser = null;
        this.cart = [];

        // Initialize app when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    // ========== INITIALIZATION ==========

    async init() {
        try {
            console.log('Initializing YepPos App...');

            // Process URL parameters for QR code compatibility
            this.processURLParameters();

            // Show loading screen
            this.showLoadingScreen();

            // Initialize core components
            await this.initializeComponents();

            // Load user data and preferences
            this.loadUserData();
            this.loadCart();
            this.loadPreferences();

            // Setup event listeners
            this.setupEventListeners();

            // Initialize page-specific functionality
            this.initializePage();

            // Hide loading screen
            setTimeout(() => {
                this.hideLoadingScreen();
                this.isLoaded = true;

                // Emit app ready event
                Utils.emit(document, EVENTS.APP_READY);

                console.log('✅ YepPos App initialized successfully');
            }, APP_CONFIG.ui.animations.loadingScreen);

        } catch (error) {
            console.error('❌ App initialization failed:', error);
            this.handleError(error);
        }
    }

    // ========== URL PARAMETER PROCESSING ==========

    processURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const companyId = urlParams.get('company_id');
        const type = urlParams.get('type');
        const g = urlParams.get('g');
        const w = urlParams.get('w');
        const token = urlParams.get('token');

        console.log('URL Parameter Processing:', {
            companyId,
            type,
            g,
            w,
            token,
            fullUrl: window.location.href
        });

        // Eski QR kodlar için (yeppos/menuler?company_id=48)
        if (companyId && !type) {
            // Branch ID'yi localStorage'a kaydet
            localStorage.setItem('menuBranchId', companyId);
            // QR ile geldiğini işaretle
            localStorage.setItem('menuBranchSelectionType', 'qr');

            // Eski QR formatları - sadece type parametresi yoksa işle
            if (g === '1') {
                // Gel-Al siparişi
                localStorage.setItem('menuOrderType', 'takeaway');
            } else if (w === '1') {
                // Paket servis
                localStorage.setItem('menuOrderType', 'delivery');
            } else {
                // Sadece company_id varsa ve g/w yoksa masa menüsü
                localStorage.setItem('menuOrderType', 'tableMenu');
            }
        }

        // Yeni QR kodlar için (web/menuler?company_id=48&type=tableMenu)
        if (type) {
            // Branch ID varsa kaydet
            if (companyId) {
                localStorage.setItem('menuBranchId', companyId);
                // QR ile geldiğini işaretle
                localStorage.setItem('menuBranchSelectionType', 'qr');
            }

            // Order type'ı localStorage'a kaydet
            if (type === 'tableMenu' || type === 'tableOrder' || type === 'takeaway' || type === 'delivery') {
                localStorage.setItem('menuOrderType', type);
            }

            // Token varsa kaydet (tableOrder için)
            if (token) {
                localStorage.setItem('tableOrderToken', token);
            }
        }

        // Eğer URL'den hiçbir parametre gelmediyse ve branchSelectionType yoksa manuel olarak işaretle
        if (!companyId && !type && !g && !w && !token) {
            const existingType = localStorage.getItem('menuBranchSelectionType');
            if (!existingType) {
                localStorage.setItem('menuBranchSelectionType', 'manual');
            }
        }

        // URL parametrelerini temizle (isteğe bağlı - sayfa yeniden yüklendiğinde tekrar işlenmesin)
        if (companyId || type || g || w || token) {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }

    async initializeComponents() {
        // Initialize header functionality
        this.initializeHeader();

        // Initialize search functionality
        this.initializeSearch();

        // Initialize user menu
        this.initializeUserMenu();

        // Initialize mobile navigation
        this.initializeMobileNav();

        // Initialize scroll effects
        this.initializeScrollEffects();

        // Initialize cookie notice
        this.initializeCookieNotice();

        // Bildirimler: Swal toast (showSwalToast) kullanılıyor

        // Initialize lazy loading
        this.initializeLazyLoading();
    }

    // ========== LOADING SCREEN ==========

    showLoadingScreen() {
        const loadingScreen = $('#loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }

    hideLoadingScreen() {
        const loadingScreen = $('#loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                loadingScreen.classList.remove('fade-out');
            }, APP_CONFIG.ui.animations.normal);
        }
    }

    // ========== HEADER FUNCTIONALITY ==========

    initializeHeader() {
        const header = $('#header');
        if (!header) return;

        // Header scroll: aşağı kaydırınca gizle, yukarı kaydırınca göster
        let lastScrollTop = 0;
        const scrollThreshold = 80;
        const showThreshold = 20;

        const handleScroll = Utils.throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollingDown = scrollTop > lastScrollTop;

            if (scrollTop <= showThreshold) {
                header.classList.remove('header-hidden');
                document.body.classList.remove('header-is-hidden');
                header.classList.remove('scrolled');
            } else {
                header.classList.add('scrolled');
                if (scrollingDown && scrollTop > scrollThreshold) {
                    header.classList.add('header-hidden');
                    document.body.classList.add('header-is-hidden');
                } else {
                    header.classList.remove('header-hidden');
                    document.body.classList.remove('header-is-hidden');
                }
            }
            lastScrollTop = scrollTop;
        }, 80);

        window.addEventListener('scroll', handleScroll);

        // Update cart count display
        this.updateCartCount();
    }

    // ========== SEARCH FUNCTIONALITY ==========

    initializeSearch() {
        const searchBtn = $('#searchToggle');
        const searchOverlay = $('#searchOverlay');
        const searchClose = $('#searchClose');
        const searchInput = $('#searchInput');

        if (!searchBtn || !searchOverlay) return;

        // Open search overlay
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';

            // Focus input after animation
            setTimeout(() => {
                if (searchInput) searchInput.focus();
            }, APP_CONFIG.ui.animations.normal);
        });

        // Close search overlay
        const closeSearch = () => {
            searchOverlay.classList.remove('show');
            document.body.style.overflow = '';
            if (searchInput) searchInput.value = '';
        };

        if (searchClose) {
            searchClose.addEventListener('click', closeSearch);
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('show')) {
                closeSearch();
            }
        });

        // Close on backdrop click
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                closeSearch();
            }
        });

        // Search functionality (demo)
        if (searchInput) {
            const debouncedSearch = Utils.debounce((query) => {
                if (query.length >= APP_CONFIG.ui.search.minCharacters) {
                    this.performSearch(query);
                }
            }, APP_CONFIG.ui.search.debounceDelay);

            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value.trim());
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const query = e.target.value.trim();
                    if (query) {
                        // Redirect to menu page with search query
                        window.location.href = `pages/menu.html?search=${encodeURIComponent(query)}`;
                    }
                }
            });
        }
    }

    performSearch(query) {
        // Demo search functionality
        console.log('Searching for:', query);
        Utils.emit(document, EVENTS.SEARCH_PERFORMED, { query });

        // In a real app, this would make an API call
        // For demo, we'll just show a toast
        setTimeout(() => {
            showSwalToast(`"${query}" için arama yapıldı`, 'info');
        }, 300);
    }

    // ========== USER MENU ==========

    initializeUserMenu() {
        const userBtn = $('#userBtn');
        const userDropdown = $('#userDropdown');
        const logoutBtn = $('#logoutBtn');

        if (!userBtn || !userDropdown) return;

        // Toggle user dropdown
        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userDropdown.contains(e.target) && !userBtn.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });

        // Handle logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Update user menu display
        this.updateUserMenu();
    }

    updateUserMenu() {
        const authLinks = $('#authLinks');
        const userLinks = $('#userLinks');
        const userName = $('#userName');

        // Mobile elements
        const mobileAuth = $('#mobileAuth');
        const mobileUserWelcome = $('#mobileUserWelcome');
        const mobileUserName = $('.mobile-user-name');

        if (this.currentUser) {
            // User is logged in
            if (authLinks) authLinks.style.display = 'none';
            if (userLinks) userLinks.style.display = 'block';
            if (userName) userName.textContent = `Merhaba, ${this.currentUser.firstName}!`;

            // Update mobile elements
            if (mobileAuth) mobileAuth.style.display = 'none';
            if (mobileUserWelcome) mobileUserWelcome.style.display = 'flex';
            if (mobileUserName) mobileUserName.textContent = this.currentUser.firstName;
        } else {
            // User is not logged in
            if (authLinks) authLinks.style.display = 'block';
            if (userLinks) userLinks.style.display = 'none';

            // Update mobile elements
            if (mobileAuth) mobileAuth.style.display = 'flex';
            if (mobileUserWelcome) mobileUserWelcome.style.display = 'none';
        }
    }

    // ========== MOBILE NAVIGATION ==========

    initializeMobileNav() {
        const mobileToggle = $('#mobileMenuBtn');
        const mobileNav = $('#mobileNav');
        const headerOverlay = $('#headerOverlay');

        if (!mobileToggle || !mobileNav) return;

        // Mobile menu toggle
        mobileToggle.addEventListener('click', () => {
            const isActive = mobileToggle.classList.contains('active');

            if (isActive) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        });

        // Close mobile menu when clicking on overlay
        if (headerOverlay) {
            headerOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Close mobile menu when clicking on a link
        const mobileLinks = $$('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Mobile dropdown functionality
        const mobileDropdowns = $$('.mobile-dropdown');
        mobileDropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.mobile-nav-link');
            const arrow = dropdown.querySelector('.mobile-dropdown-arrow');

            if (link && arrow) {
                arrow.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdown.classList.toggle('active');
                });
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    openMobileMenu() {
        const mobileToggle = $('#mobileMenuBtn');
        const mobileNav = $('#mobileNav');
        const headerOverlay = $('#headerOverlay');

        // Create backdrop if it doesn't exist
        let backdrop = $('.mobile-nav-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'mobile-nav-backdrop';
            document.body.appendChild(backdrop);

            // Add click listener to backdrop
            backdrop.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        if (mobileToggle && mobileNav) {
            mobileToggle.classList.add('active');
            mobileNav.classList.add('active');
            backdrop.classList.add('active');
            document.body.classList.add('menu-open');

            if (headerOverlay) {
                headerOverlay.classList.add('active');
            }
        }
    }

    closeMobileMenu() {
        const mobileToggle = $('#mobileMenuBtn');
        const mobileNav = $('#mobileNav');
        const headerOverlay = $('#headerOverlay');
        const backdrop = $('.mobile-nav-backdrop');

        if (mobileToggle && mobileNav) {
            mobileToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.classList.remove('menu-open');

            if (backdrop) {
                backdrop.classList.remove('active');
            }

            if (headerOverlay) {
                headerOverlay.classList.remove('active');
            }

            // Close all mobile dropdowns
            const mobileDropdowns = $$('.mobile-dropdown.active');
            mobileDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    }

    // ========== SCROLL EFFECTS ==========

    initializeScrollEffects() {
        // Smooth scroll for anchor links
        const anchorLinks = $$('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = $(href);
                if (target) {
                    Utils.scrollTo(target, 80); // Offset for fixed header
                }
            });
        });

        // Intersection Observer for animations
        if (FEATURES.intersectionObserver) {
            this.initializeScrollAnimations();
        }
    }

    initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = $$('.category-card, .contact-card, .about-content, .qr-content');
        animateElements.forEach(el => observer.observe(el));
    }

    // ========== LAZY LOADING ==========

    initializeLazyLoading() {
        if (!FEATURES.intersectionObserver) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        Utils.lazyLoadImage(img, img.dataset.src);
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        // Observe all images with data-src attribute
        const lazyImages = $$('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ========== COOKIE NOTICE ==========

    initializeCookieNotice() {
        const cookieNotice = $('#cookieNotice');
        const cookieAccept = $('#cookieAccept');
        const cookieDecline = $('#cookieDecline');

        if (!cookieNotice) return;

        // Check if user has already made a choice
        const cookiesAccepted = Utils.getStorage(APP_CONFIG.storage.cookies);

        if (cookiesAccepted === null) {
            // Show cookie notice after a delay
            setTimeout(() => {
                cookieNotice.classList.add('show');
            }, 2000);
        }

        // Handle accept
        if (cookieAccept) {
            cookieAccept.addEventListener('click', () => {
                Utils.setStorage(APP_CONFIG.storage.cookies, true);
                cookieNotice.classList.remove('show');
                showSwalToast('Çerez ayarları kaydedildi', 'success');
            });
        }

        // Handle decline
        if (cookieDecline) {
            cookieDecline.addEventListener('click', () => {
                Utils.setStorage(APP_CONFIG.storage.cookies, false);
                cookieNotice.classList.remove('show');
                showSwalToast('Çerez ayarları kaydedildi', 'info');
            });
        }
    }

    // ========== USER DATA MANAGEMENT ==========

    loadUserData() {
        const userData = Utils.getStorage(APP_CONFIG.storage.user);
        if (userData) {
            this.currentUser = userData;
            console.log('User data loaded:', this.currentUser);
        }
    }

    saveUserData() {
        if (this.currentUser) {
            Utils.setStorage(APP_CONFIG.storage.user, this.currentUser);
        }
    }

    logout() {
        this.currentUser = null;
        Utils.removeStorage(APP_CONFIG.storage.user);
        Utils.removeStorage(APP_CONFIG.storage.session);

        this.updateUserMenu();
        showSwalToast(APP_CONFIG.success.logout, 'success');

        // Emit logout event
        Utils.emit(document, EVENTS.USER_LOGOUT);

        // Redirect to home page if on a protected page
        if (window.location.pathname.includes('/profile') || window.location.pathname.includes('/orders')) {
            window.location.href = '/index.html';
        }
    }

    // ========== CART MANAGEMENT ==========

    loadCart() {
        const cartData = Utils.getStorage(APP_CONFIG.storage.cart, []);
        this.cart = Array.isArray(cartData) ? cartData : [];
        this.updateCartCount();
    }

    updateCartCount() {
        const cartCount = $('#cartCount');
        const mobileCartCounts = document.querySelectorAll('.mobile-cart-count');

        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

            // Update all mobile cart count elements
            mobileCartCounts.forEach(element => {
                element.textContent = totalItems;
                element.style.display = totalItems > 0 ? 'flex' : 'none';
            });
        }
    }

    // ========== PREFERENCES ==========

    loadPreferences() {
        const preferences = Utils.getStorage(APP_CONFIG.storage.preferences, {});

        // Apply theme preference
        if (preferences.theme) {
            this.applyTheme(preferences.theme);
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        Utils.setStorage(APP_CONFIG.storage.preferences, { theme });
    }

    // ========== PAGE-SPECIFIC INITIALIZATION ==========

    initializePage() {
        const path = window.location.pathname;

        if (path.includes('index.html') || path === '/' || path === '') {
            this.initializeHomePage();
        } else if (path.includes('menu.html')) {
            this.initializeMenuPage();
        } else if (path.includes('siparis')) {
            this.initializeCartPage();
        } else if (path.includes('profile.html')) {
            this.initializeProfilePage();
        }
    }

    initializeHomePage() {
        console.log('Initializing home page...');

        // Initialize category cards hover effects
        const categoryCards = $$('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                if (category) {
                    window.location.href = `pages/menu.html?category=${category}`;
                }
            });
        });

        // QR code generation
        const generateQRBtn = $('button[onclick="generateQR()"]');
        if (generateQRBtn) {
            generateQRBtn.removeAttribute('onclick');
            generateQRBtn.addEventListener('click', this.generateQRCode.bind(this));
        }

        // Hero image parallax effect (if supported)
        if (!ENV.isMobile) {
            this.initializeParallax();
        }
    }

    initializeMenuPage() {
        console.log('Initializing menu page...');
        // Menu page specific functionality will be added when we create the menu page
    }

    initializeCartPage() {
        console.log('Initializing cart page...');
        // Cart page specific functionality will be added when we create the cart page
    }

    initializeProfilePage() {
        console.log('Initializing profile page...');
        // Profile page specific functionality will be added when we create the profile page
    }

    // ========== PARALLAX EFFECT ==========

    initializeParallax() {
        const heroImage = $('.hero-img');
        if (!heroImage) return;

        const handleParallax = Utils.throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroImage.style.transform = `translateY(${rate}px)`;
        }, 16); // ~60fps

        window.addEventListener('scroll', handleParallax);
    }

    // ========== QR CODE GENERATION ==========

    generateQRCode() {
        const menuUrl = `${window.location.origin}/pages/menu.html`;
        const qrCodeImg = $('.qr-code img');

        if (qrCodeImg) {
            const newQRUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(menuUrl)}`;
            qrCodeImg.src = newQRUrl;

            showSwalToast('QR kod yenilendi!', 'success');
        }
    }

    // ========== ERROR HANDLING ==========

    handleError(error) {
        console.error('App Error:', error);

        const errorMessage = error.message || APP_CONFIG.errors.generic;
        showSwalToast(errorMessage, 'error');

        // Emit error event
        Utils.emit(document, EVENTS.APP_ERROR, { error });

        // Hide loading screen on error
        this.hideLoadingScreen();
    }

    // ========== GLOBAL EVENT HANDLERS ==========

    setupEventListeners() {
        // Online/offline status
        window.addEventListener('online', () => {
            showSwalToast('İnternet bağlantısı yeniden kuruldu', 'success');
        });

        window.addEventListener('offline', () => {
            showSwalToast('İnternet bağlantısı kesildi', 'warning');
        });

        // Unload warning for unsaved changes (cart items)
        window.addEventListener('beforeunload', (e) => {
            if (this.cart.length > 0) {
                const message = 'Sepetinizde ürünler var. Sayfadan ayrılmak istediğinizden emin misiniz?';
                e.returnValue = message;
                return message;
            }
        });

        // Handle app-level custom events
        document.addEventListener(EVENTS.USER_LOGIN, () => {
            this.updateUserMenu();
        });

        document.addEventListener(EVENTS.CART_UPDATED, () => {
            this.updateCartCount();
        });

        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                const isDark = document.body.classList.toggle('dark-mode');
                this.applyTheme(isDark ? 'dark' : 'light');
            });
        }
    }
}

// ========== SWAL TOAST (toastContainer yerine) ==========
function showSwalToast(message, type = 'info', duration = 3000) {
    if (typeof window.Swal !== 'undefined' && typeof window.Swal.fire === 'function') {
        window.Swal.fire({
            text: message,
            icon: type,
            timer: duration,
            timerProgressBar: true,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            width: 'auto',
            padding: '1rem 1.5rem'
        });
    }
}
window.showSwalToast = showSwalToast;

// ========== GLOBAL FUNCTIONS ==========

// QR Code generation function (for HTML onclick)
function generateQR() {
    if (window.app) {
        window.app.generateQRCode();
    }
}

// ========== SET ACTIVE NAV FUNCTION ========== //
function setActiveNavLink() {
    const path = window.location.pathname;
    const normalizedPath = path.toLowerCase().replace(/\/$/, '');
    const pathSegments = path.split('/').filter(Boolean);
    const currentPathSegment = normalizedPath.split('/').pop() || '';
    const pathSegmentWithoutExt = currentPathSegment.replace(/\.php$/, '');

    const knownPageSlugs = ['menuler', 'hakkimizda', 'subeler', 'franchise', 'kampanyalar', 'iletisim', 'haberler', 'sayfalar', 'sepet'];

    let targetSegment = '';
    if (pathSegmentWithoutExt === 'hesabim' || pathSegmentWithoutExt === 'siparislerim' ||
        pathSegmentWithoutExt === 'bilgilerim' || pathSegmentWithoutExt === 'adreslerim') {
        targetSegment = '';
    } else if (currentPathSegment === 'menuler' || currentPathSegment === 'menu.php') {
        targetSegment = 'menuler';
    } else if (currentPathSegment === 'hakkimizda' || currentPathSegment === 'hakkimizda.php') {
        targetSegment = 'hakkimizda';
    } else if (currentPathSegment === 'subeler' || currentPathSegment === 'subeler.php') {
        targetSegment = 'subeler';
    } else if (currentPathSegment === 'franchise' || currentPathSegment === 'franchise.php') {
        targetSegment = 'franchise';
    } else if (currentPathSegment === 'kampanyalar' || currentPathSegment === 'kampanyalar.php') {
        targetSegment = 'kampanyalar';
    } else if (currentPathSegment === 'iletisim' || currentPathSegment === 'iletisim.php') {
        targetSegment = 'iletisim';
    } else if (currentPathSegment === 'haberler' || normalizedPath.includes('/haberler/')) {
        targetSegment = 'haberler';
    } else if (currentPathSegment === 'sayfalar' || normalizedPath.includes('/sayfalar/')) {
        targetSegment = 'sayfalar';
    } else if (currentPathSegment === 'sepet') {
        targetSegment = 'sepet';
    } else if (pathSegments.length === 0 || normalizedPath === '/' || normalizedPath === '/web' || normalizedPath.endsWith('/web') || currentPathSegment === 'index.php' ||
        (pathSegments.length === 1 && !knownPageSlugs.includes(pathSegments[0].toLowerCase()))) {
        targetSegment = 'index';
    }

    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .nav-dropdown-item, .mobile-nav-submenu-item');

    // First, remove all active classes
    navLinks.forEach((link) => {
        link.classList.remove('active');
    });

    // Profile pages - don't set any nav as active, return early
    if (targetSegment === '') {
        return;
    }

    // Then, activate matching links (nav-link, mobile-nav-link, nav-dropdown-item, mobile-nav-submenu-item)
    navLinks.forEach((link) => {
        const linkHref = link.getAttribute('href') || '';
        if (linkHref === '#') return;
        const linkPath = linkHref.toLowerCase().replace(/^\.\.\//, '').replace(/^\.\//, '').replace(/^\//, '').replace(/\/$/, '');
        const linkSegment = linkPath.split('/').pop() || linkPath;

        let isActive = false;

        if (targetSegment === 'index') {
            if (linkPath === 'index.php' || linkPath === '' || linkPath === 'index' || linkHref === './' || linkHref === '') {
                isActive = true;
            }
        } else if (targetSegment) {
            if (linkSegment === targetSegment || linkPath === targetSegment || linkPath.endsWith('/' + targetSegment)) {
                isActive = true;
            }
        }

        if (isActive) {
            link.classList.add('active');

            // Dropdown alt sayfasındaysak parent (Kurumsal) linkini de aktif yap
            if (targetSegment === 'hakkimizda' || targetSegment === 'subeler' || targetSegment === 'franchise' || targetSegment === 'haberler' || targetSegment === 'sayfalar') {
                const parentItem = link.closest('.has-dropdown, .has-submenu');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link, .mobile-nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            }
        }
    });
}

// ========== HEADER MANAGER ========== //
class HeaderManager {
    constructor() {
        this.header = document.querySelector('.header');
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.mobileNav = document.getElementById('mobileNav');
        this.headerOverlay = document.getElementById('headerOverlay');
        this.searchToggle = document.getElementById('searchToggle');
        this.searchOverlay = document.getElementById('searchOverlay');
        this.searchClose = document.getElementById('searchClose');
        this.searchInput = document.getElementById('searchInput');

        this.init();
    }

    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSearch();
        this.setupDropdowns();
        this.setupClickOutside();
        this.setupKeyboardShortcuts();
        this.setActiveNav();
    }

    setupScrollEffect() {
        if (!this.header) return;

        let lastScrollY = window.scrollY;
        const scrollThreshold = 80;
        const showThreshold = 20;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const scrollingDown = currentScrollY > lastScrollY;

            if (currentScrollY <= showThreshold) {
                this.header.classList.remove('header-hidden');
                document.body.classList.remove('header-is-hidden');
                this.header.classList.remove('scrolled');
            } else {
                this.header.classList.add('scrolled');
                if (scrollingDown && currentScrollY > scrollThreshold) {
                    this.header.classList.add('header-hidden');
                    document.body.classList.add('header-is-hidden');
                } else {
                    this.header.classList.remove('header-hidden');
                    document.body.classList.remove('header-is-hidden');
                }
            }
            lastScrollY = currentScrollY;
        });
    }

    setupMobileMenu() {
        if (!this.mobileMenuBtn || !this.mobileNav) return;

        this.mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });

        // Mobile dropdown toggles
        const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
        mobileDropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.mobile-nav-link');
            const arrow = dropdown.querySelector('.mobile-dropdown-arrow');

            if (link && arrow) {
                link.addEventListener('click', (e) => {
                    if (e.target.closest('.mobile-dropdown-arrow')) {
                        e.preventDefault();
                        this.toggleMobileDropdown(dropdown);
                    }
                });
            }
        });

        // Close mobile menu when clicking on overlay
        if (this.headerOverlay) {
            this.headerOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }
    }

    toggleMobileMenu() {
        const isActive = this.mobileNav.classList.contains('active');

        if (isActive) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        if (this.mobileNav) this.mobileNav.classList.add('active');
        if (this.mobileMenuBtn) this.mobileMenuBtn.classList.add('active');
        if (this.headerOverlay) this.headerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        if (this.mobileNav) this.mobileNav.classList.remove('active');
        if (this.mobileMenuBtn) this.mobileMenuBtn.classList.remove('active');
        if (this.headerOverlay) this.headerOverlay.classList.remove('active');
        document.body.style.overflow = '';

        // Close all mobile dropdowns
        const activeDropdowns = document.querySelectorAll('.mobile-dropdown.active');
        activeDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }

    toggleMobileDropdown(dropdown) {
        const isActive = dropdown.classList.contains('active');

        // Close other dropdowns
        const otherDropdowns = document.querySelectorAll('.mobile-dropdown.active');
        otherDropdowns.forEach(other => {
            if (other !== dropdown) {
                other.classList.remove('active');
            }
        });

        // Toggle current dropdown
        dropdown.classList.toggle('active', !isActive);
    }

    setupSearch() {
        if (!this.searchToggle || !this.searchOverlay) return;

        this.searchToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.openSearch();
        });

        if (this.searchClose) {
            this.searchClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeSearch();
            });
        }

        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearchInput(e.target.value);
            });

            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeSearch();
                }
            });
        }

        // Close search when clicking on overlay
        this.searchOverlay.addEventListener('click', (e) => {
            if (e.target === this.searchOverlay) {
                this.closeSearch();
            }
        });
    }

    openSearch() {
        this.searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus on input after animation
        setTimeout(() => {
            if (this.searchInput) {
                this.searchInput.focus();
            }
        }, 300);
    }

    closeSearch() {
        this.searchOverlay.classList.remove('active');
        document.body.style.overflow = '';

        if (this.searchInput) {
            this.searchInput.value = '';
        }
    }

    handleSearchInput(query) {
        if (query.length > 2) {
            // Implement search functionality here
            console.log('Searching for:', query);
            // You can add actual search logic here
        }
    }

    setupDropdowns() {
        const dropdownItems = document.querySelectorAll('.nav-item');

        dropdownItems.forEach(item => {
            const dropdown = item.querySelector('.dropdown-menu');
            if (!dropdown) return;

            let hoverTimeout;

            item.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                this.showDropdown(dropdown);
            });

            item.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    this.hideDropdown(dropdown);
                }, 100);
            });
        });
    }

    showDropdown(dropdown) {
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        dropdown.style.transform = 'translateX(-50%) translateY(0) scale(1)';
    }

    hideDropdown(dropdown) {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        dropdown.style.transform = 'translateX(-50%) translateY(-10px) scale(0.95)';
    }

    setupClickOutside() {
        document.addEventListener('click', (e) => {
            // Close mobile menu if clicking outside
            if (this.mobileNav && !this.mobileNav.contains(e.target) &&
                this.mobileMenuBtn && !this.mobileMenuBtn.contains(e.target) &&
                this.mobileNav.classList.contains('active')) {
                this.closeMobileMenu();
            }

            // Close search if clicking outside
            if (this.searchOverlay && !e.target.closest('.search-container') &&
                !e.target.closest('.search-overlay') &&
                this.searchOverlay.classList.contains('active')) {
                this.closeSearch();
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to open search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }

            // Escape to close overlays
            if (e.key === 'Escape') {
                if (this.searchOverlay && this.searchOverlay.classList.contains('active')) {
                    this.closeSearch();
                }
                if (this.mobileNav && this.mobileNav.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            }
        });
    }

    setActiveNav() {
        setActiveNavLink();
    }

    // Public methods for external use
    updateCartCount(count) {
        const cartCounts = document.querySelectorAll('.cart-count, .mobile-cart-count, #mobileCartCount, #fixedCartCount');
        cartCounts.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    updateCartTotal(total) {
        const cartTotals = document.querySelectorAll('.cart-total');
        cartTotals.forEach(element => {
            element.textContent = `${total} TL`;
        });
    }

    updateUserStatus(isLoggedIn, userData = null) {
        const authLinks = document.getElementById('authLinks');
        const userLinks = document.getElementById('userLinks');
        const mobileAuth = document.getElementById('mobileAuth');
        const mobileUserWelcome = document.getElementById('mobileUserWelcome');

        if (isLoggedIn && userData) {
            // Desktop
            if (authLinks) authLinks.style.display = 'none';
            if (userLinks) userLinks.style.display = 'block';

            // Mobile
            if (mobileAuth) mobileAuth.style.display = 'none';
            if (mobileUserWelcome) mobileUserWelcome.style.display = 'flex';

            // Update user info; userNameDisplay: sadece name, en fazla 10 karakter
            const userNameElements = document.querySelectorAll('#userName, .mobile-user-name');
            const userEmailElements = document.querySelectorAll('#userEmail');
            const userDisplayElements = document.querySelectorAll('#userNameDisplay');
            const namePart = (userData.firstName && userData.firstName.trim()) ? userData.firstName.trim() : (String(userData.name || '').trim().split(/\s+/)[0] || userData.name || '');
            const displayName = namePart.length > 10 ? namePart.substring(0, 10) : namePart;

            userNameElements.forEach(el => el.textContent = userData.name);
            userEmailElements.forEach(el => el.textContent = userData.email);
            userDisplayElements.forEach(el => el.textContent = displayName);
            // Header avatar: baş harfler (AÇ, YEP)
            const userAvatar = document.getElementById('userAvatar');
            if (userAvatar && userData.name) {
                const words = String(userData.name).trim().split(/\s+/).filter(Boolean);
                const initials = words.slice(0, 3).map((w) => (w.charAt(0) || '')).join('').toUpperCase();
                if (initials) {
                    userAvatar.innerHTML = '<span class="profile-menu-avatar-initials">' + initials + '</span>';
                } else {
                    userAvatar.innerHTML = '<i class="fas fa-user"></i>';
                }
            } else if (userAvatar) {
                userAvatar.innerHTML = '<i class="fas fa-user"></i>';
            }

        } else {
            // Desktop
            if (authLinks) authLinks.style.display = 'block';
            if (userLinks) userLinks.style.display = 'none';

            // Mobile
            if (mobileAuth) mobileAuth.style.display = 'flex';
            if (mobileUserWelcome) mobileUserWelcome.style.display = 'none';

            // Reset display text
            const userDisplayElements = document.querySelectorAll('#userNameDisplay');
            userDisplayElements.forEach(el => el.textContent = 'Giriş');
            const userAvatar = document.getElementById('userAvatar');
            if (userAvatar) {
                userAvatar.innerHTML = '<i class="fas fa-user"></i>';
            }
        }
    }
}

// ========== CART MANAGER ========== //
class CartManager {
    constructor() {
        this.items = this.loadCartFromStorage();
        this.headerManager = null;
        this.init();
    }

    init() {
        this.updateCartDisplay();
        this.setupEventListeners();
    }

    setHeaderManager(headerManager) {
        this.headerManager = headerManager;
    }

    loadCartFromStorage() {
        try {
            const saved = localStorage.getItem('yeppos_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            return [];
        }
    }

    saveCartToStorage() {
        try {
            localStorage.setItem('yeppos_cart', JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    }

    addItem(item) {
        const existingItem = this.items.find(cartItem => cartItem.id === item.id);

        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            this.items.push({
                ...item,
                quantity: item.quantity || 1,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCartToStorage();
        this.updateCartDisplay();
        this.showAddToCartFeedback(item);
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCartToStorage();
        this.updateCartDisplay();
    }

    updateItemQuantity(itemId, quantity) {
        const item = this.items.find(cartItem => cartItem.id === itemId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = quantity;
                this.saveCartToStorage();
                this.updateCartDisplay();
            }
        }
    }

    clearCart() {
        this.items = [];
        this.saveCartToStorage();
        this.updateCartDisplay();
    }

    getCartCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getCartTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    updateCartDisplay() {
        const count = this.getCartCount();
        const total = this.getCartTotal();

        if (this.headerManager) {
            this.headerManager.updateCartCount(count);
            this.headerManager.updateCartTotal(total.toFixed(2));
        }
    }

    showAddToCartFeedback(item) {
        // Create and show feedback notification
        const feedback = document.createElement('div');
        feedback.className = 'cart-feedback show';
        feedback.innerHTML = `
            <div class="cart-feedback-content">
                <i class="fas fa-check-circle"></i>
                <span>${item.name} sepete eklendi!</span>
            </div>
        `;

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 300);
        }, 2000);
    }

    setupEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart') ||
                e.target.closest('.add-to-cart')) {

                const button = e.target.classList.contains('add-to-cart') ?
                    e.target : e.target.closest('.add-to-cart');

                const productCard = button.closest('.menu-card, .product-card');
                if (productCard) {
                    this.handleAddToCart(productCard, button);
                }
            }
        });
    }

    handleAddToCart(productCard, button) {
        // Extract product data from card
        const id = productCard.dataset.productId || Date.now().toString();
        const name = productCard.querySelector('h3, .product-name')?.textContent || 'Ürün';
        const priceText = productCard.querySelector('.price')?.textContent || '0';
        const price = parseFloat(priceText.replace(/[\s]/g, '').replace(',', '.')) || 0;
        const image = productCard.querySelector('img')?.src || '';

        const item = {
            id,
            name,
            price,
            image,
            quantity: 1
        };

        // Add loading state to button
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;

        // Simulate add to cart delay
        setTimeout(() => {
            this.addItem(item);

            // Reset button
            button.innerHTML = originalText;
            button.disabled = false;
        }, 500);
    }
}

// ========== AUTH MANAGER ========== //
class AuthManager {
    constructor() {
        this.currentUser = this.loadUserFromStorage();
        this.headerManager = null;
        this.init();
    }

    init() {
        this.updateAuthDisplay();
        this.setupEventListeners();
    }

    setHeaderManager(headerManager) {
        this.headerManager = headerManager;
    }

    loadUserFromStorage() {
        try {
            const saved = localStorage.getItem('yeppos_user');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error loading user from storage:', error);
            return null;
        }
    }

    saveUserToStorage(user) {
        try {
            localStorage.setItem('yeppos_user', JSON.stringify(user));
        } catch (error) {
            console.error('Error saving user to storage:', error);
        }
    }

    login(userData) {
        this.currentUser = userData;
        this.saveUserToStorage(userData);
        this.updateAuthDisplay();
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('yeppos_user');
        this.updateAuthDisplay();
    }

    updateAuthDisplay() {
        if (this.headerManager) {
            this.headerManager.updateUserStatus(!!this.currentUser, this.currentUser);
        }
    }

    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }

    isLoggedIn() {
        return !!this.currentUser;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// ========== APP INITIALIZATION ========== //
class App {
    constructor() {
        this.headerManager = new HeaderManager();
        this.cartManager = new CartManager();
        this.authManager = new AuthManager();

        // DARK MODE TOGGLE
        this.initDarkMode();

        this.init();
    }

    initDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        // Tercihi uygula
        const theme = localStorage.getItem('yeppos_theme');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        // Toggle butonu
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                const isDark = document.body.classList.toggle('dark-mode');
                localStorage.setItem('yeppos_theme', isDark ? 'dark' : 'light');
            });
        }
    }

    init() {
        // Show loading screen
        this.showLoadingScreen();

        // Connect managers
        this.cartManager.setHeaderManager(this.headerManager);
        this.authManager.setHeaderManager(this.headerManager);

        // Setup global event listeners
        this.setupGlobalEvents();

        // Hide loading screen after initialization
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 1000);
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                loadingScreen.classList.remove('fade-out');
                document.body.classList.add('loaded');
            }, 500);
        }
    }

    setupGlobalEvents() {
        // Page load complete
        window.addEventListener('load', () => {
            this.hideLoadingScreen();
        });

        // Handle page navigation
        window.addEventListener('beforeunload', () => {
            // Save any pending data
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            console.log('Connection restored');
        });

        window.addEventListener('offline', () => {
            console.log('Connection lost');
        });
    }
}

// ========== START APP ========== //
document.addEventListener('DOMContentLoaded', () => {
    window.yepposApp = new App();

    // Mobile Navigation Close Button
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');

    if (mobileNavClose && mobileMenuBtn && mobileNav) {
        mobileNavClose.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.classList.remove('menu-open');

            // Remove all overlays and backdrops
            const backdrop = document.querySelector('.mobile-nav-backdrop');
            if (backdrop) {
                backdrop.classList.remove('active');
            }

            const headerOverlay = document.getElementById('headerOverlay');
            if (headerOverlay) {
                headerOverlay.classList.remove('active');
            }

            // Remove any blur from body
            document.body.style.overflow = '';
            document.body.style.filter = '';

            // Close all mobile dropdowns
            const mobileDropdowns = document.querySelectorAll('.mobile-dropdown.active');
            mobileDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        });
    }
});

// ========== UTILITY FUNCTIONS ========== //
function generateQR() {
    const qrCodeImg = document.querySelector('.qr-code img');
    if (qrCodeImg) {
        const url = window.location.origin + '/pages/menu.html?qr=true';
        qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    }
}

// Make functions globally available
window.generateQR = generateQR;

// ========== HERO SLIDER FUNCTIONALITY ==========

(function () {
    'use strict';

    let currentSlide = 0;
    let autoplayTimer = null;
    let isTransitioning = false;

    function initHeroSlider() {
        const sliderTrack = document.getElementById('heroSliderTrack');
        const sliderDots = document.getElementById('heroSliderDots');
        const prevBtn = document.getElementById('heroSliderPrev');
        const nextBtn = document.getElementById('heroSliderNext');

        if (!sliderTrack || !APP_CONFIG.hero || !APP_CONFIG.hero.slides) {
            return;
        }

        const slides = APP_CONFIG.hero.slides;
        const isSingleSlide = slides.length <= 1;
        const sliderWrapper = sliderTrack.closest('.hero-slider-wrapper');
        sliderWrapper?.classList.toggle('is-single-slide', isSingleSlide);
        [prevBtn, nextBtn].forEach((button) => {
            if (!button) return;
            button.hidden = isSingleSlide;
            button.disabled = isSingleSlide;
            button.setAttribute('aria-hidden', isSingleSlide ? 'true' : 'false');
        });
        if (sliderDots) {
            sliderDots.hidden = isSingleSlide;
            sliderDots.setAttribute('aria-hidden', isSingleSlide ? 'true' : 'false');
        }

        if (typeof window.__cleanupTahmisciHeroMedia === 'function') {
            window.__cleanupTahmisciHeroMedia();
            window.__cleanupTahmisciHeroMedia = null;
        }

        // Render slides
        sliderTrack.innerHTML = '';
        slides.forEach((slide, index) => {
            const slideElement = createSlideElement(slide, index);
            sliderTrack.appendChild(slideElement);
        });

        // Render dots
        if (sliderDots && !isSingleSlide) {
            sliderDots.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'hero-slider-dot';
                if (index === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Slide ${index + 1}`);
                dot.addEventListener('click', () => goToSlide(index));
                sliderDots.appendChild(dot);
            });
        }

        // Navigation buttons
        if (prevBtn && !isSingleSlide) {
            prevBtn.addEventListener('click', () => prevSlide());
        }

        if (nextBtn && !isSingleSlide) {
            nextBtn.addEventListener('click', () => nextSlide());
        }

        if (isSingleSlide) {
            currentSlide = 0;
            updateSlider();
            stopAutoplay();
            return;
        }

        // Touch/swipe support
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        sliderTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            stopAutoplay();
        });

        sliderTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });

        sliderTrack.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;

            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            startAutoplay();
        });

        // Mouse drag support
        sliderTrack.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = true;
            stopAutoplay();
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            currentX = e.clientX;
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;

            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            startAutoplay();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });

        // Initialize
        updateSlider();
        startAutoplay();
    }

    function getHeroBasePath() {
        return getSiteRoot();
    }

    function resolveHeroMediaUrl(source) {
        let mediaUrl = String(source || '').trim();
        if (mediaUrl && !/^https?:\/\//i.test(mediaUrl)) {
            const base = getHeroBasePath();
            mediaUrl = (base ? base + '/' : '') + mediaUrl.replace(/^\//, '');
        }
        return mediaUrl;
    }

    function createSlideElement(slide, index) {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'hero-slide';
        const imgUrl = resolveHeroMediaUrl(slide.backgroundImage);
        if (imgUrl) {
            slideDiv.style.backgroundImage = `url("${imgUrl}")`;
        }
        slideDiv.setAttribute('data-slide-index', index);

        const content = document.createElement('div');
        content.className = 'hero-slide-content';

        const brand = document.createElement('span');
        brand.className = 'hero-slide-brand';
        brand.textContent = slide.brand || 'Tahmisçi Coffee & Roastery';

        const title = document.createElement('h1');
        title.className = 'hero-slide-title';
        title.textContent = slide.title;

        const description = document.createElement('p');
        description.className = 'hero-slide-description';
        description.textContent = slide.description;

        const actions = document.createElement('div');
        actions.className = 'hero-slide-actions';

        const button = document.createElement('a');
        const url = slide.buttonUrl || slide.buttonLink || '#';
        if (url.startsWith('http') || url.startsWith('/')) {
            button.href = url;
        } else {
            const basePath = getHeroBasePath();
            button.href = (basePath ? basePath + '/' : '') + url;
        }
        button.className = 'btn btn-primary btn-large';

        if (slide.buttonIcon) {
            const icon = document.createElement('i');
            icon.className = slide.buttonIcon;
            button.appendChild(icon);
        }

        button.appendChild(document.createTextNode(` ${slide.buttonText || ''}`));

        const aboutButton = document.createElement('a');
        aboutButton.href = slide.secondaryButtonUrl || '#about';
        aboutButton.className = 'btn btn-secondary btn-large hero-about-btn';
        aboutButton.textContent = slide.secondaryButtonText || (localStorage.getItem('site_language') === 'en' ? 'About Us' : 'Hakkımızda');

        actions.appendChild(button);
        actions.appendChild(aboutButton);
        content.appendChild(brand);
        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(actions);
        slideDiv.appendChild(content);

        if (index === 0 && APP_CONFIG.hero?.media) {
            const media = APP_CONFIG.hero.media;
            const productMediaUrl = resolveHeroMediaUrl(media.coldDrinksTop);
            const productFallbackUrl = resolveHeroMediaUrl(media.coldDrinksFront);
            const baristaMediaUrl = resolveHeroMediaUrl(media.detail);
            const baristaFallbackUrl = resolveHeroMediaUrl(media.primary);
            const useHeroVideo = APP_CONFIG.hero.mediaType !== 'image';
            const heroImageUrl = resolveHeroMediaUrl(media.primary);
            const reelPlaylist = (useHeroVideo ? [media.reelSecondary, media.reelPrimary] : [])
                .map(resolveHeroMediaUrl)
                .filter(Boolean);
            const reelMediaUrl = reelPlaylist[0] || '';
            const reelPosterUrl = resolveHeroMediaUrl(media.reelPoster || media.coldDrinksFront || media.detail);

            if (reelMediaUrl || productMediaUrl || baristaMediaUrl) {
                const mediaStage = document.createElement('div');
                mediaStage.className = 'hero-media-stage';

                if (reelMediaUrl) {
                    const reelPanel = document.createElement('figure');
                    reelPanel.className = 'hero-main-media';
                    reelPanel.setAttribute('aria-label', localStorage.getItem('site_language') === 'en'
                        ? 'Tahmisçi featured video'
                        : 'Tahmisçi öne çıkan video');

                    const reelVideo = document.createElement('video');
                    reelVideo.className = 'hero-main-video';
                    reelVideo.poster = reelPosterUrl;
                    reelVideo.autoplay = true;
                    reelVideo.muted = true;
                    reelVideo.defaultMuted = true;
                    reelVideo.loop = false;
                    reelVideo.playsInline = true;
                    reelVideo.preload = 'auto';
                    reelVideo.disablePictureInPicture = true;
                    reelVideo.controls = false;
                    reelVideo.setAttribute('autoplay', '');
                    reelVideo.setAttribute('muted', '');
                    reelVideo.setAttribute('playsinline', '');
                    reelVideo.setAttribute('preload', 'auto');
                    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    if (reduceMotion) {
                        reelVideo.autoplay = false;
                        reelVideo.removeAttribute('autoplay');
                        reelVideo.preload = 'metadata';
                    }

                    const reelSource = document.createElement('source');
                    reelSource.src = reelMediaUrl;
                    reelSource.type = 'video/mp4';
                    reelVideo.appendChild(reelSource);
                    reelPanel.appendChild(reelVideo);
                    mediaStage.appendChild(reelPanel);

                    reelPanel.dataset.mediaState = 'loading';
                    reelPanel.dataset.playlistLoop = 'true';
                    let reelIndex = 0;
                    let consecutiveReelErrors = 0;
                    const pauseReel = (state) => {
                        reelPanel.dataset.mediaState = state;
                        reelVideo.pause();
                    };
                    const playReel = () => {
                        if (reduceMotion) {
                            pauseReel('reduced-motion');
                            return;
                        }
                        reelVideo.autoplay = true;
                        reelVideo.setAttribute('autoplay', '');
                        const playPromise = reelVideo.play();
                        if (playPromise && typeof playPromise.catch === 'function') {
                            playPromise
                                .then(() => { reelPanel.dataset.mediaState = 'playing'; })
                                .catch(() => pauseReel('play-blocked'));
                        }
                    };
                    const handleLoadedData = () => {
                        consecutiveReelErrors = 0;
                        reelPanel.dataset.loadedData = 'true';
                        reelPanel.dataset.mediaState = 'loadeddata';
                        playReel();
                    };
                    const handleCanPlay = () => {
                        reelPanel.dataset.canPlay = 'true';
                        reelPanel.dataset.mediaState = 'canplay';
                        playReel();
                    };
                    const loadReelAt = (indexToLoad) => {
                        if (!reelPlaylist.length) return;
                        reelIndex = (indexToLoad + reelPlaylist.length) % reelPlaylist.length;
                        reelPanel.dataset.reelIndex = String(reelIndex);
                        reelSource.src = reelPlaylist[reelIndex];
                        reelPanel.dataset.mediaState = 'loading-next';
                        reelVideo.load();
                    };
                    const handleReelEnded = () => loadReelAt(reelIndex + 1);
                    const handleReelError = () => {
                        consecutiveReelErrors += 1;
                        if (consecutiveReelErrors < reelPlaylist.length) {
                            loadReelAt(reelIndex + 1);
                            return;
                        }
                        pauseReel('error');
                    };
                    reelVideo.addEventListener('loadeddata', handleLoadedData);
                    reelVideo.addEventListener('canplay', handleCanPlay);
                    reelVideo.addEventListener('ended', handleReelEnded);
                    reelVideo.addEventListener('error', handleReelError);
                    window.__cleanupTahmisciHeroMedia = () => {
                        reelVideo.removeEventListener('loadeddata', handleLoadedData);
                        reelVideo.removeEventListener('canplay', handleCanPlay);
                        reelVideo.removeEventListener('ended', handleReelEnded);
                        reelVideo.removeEventListener('error', handleReelError);
                        reelVideo.pause();
                    };
                    requestAnimationFrame(playReel);
                } else if (!useHeroVideo && heroImageUrl) {
                    const imagePanel = document.createElement('figure');
                    imagePanel.className = 'hero-main-media';
                    const mainImage = document.createElement('img');
                    mainImage.className = 'hero-main-image';
                    mainImage.src = heroImageUrl;
                    mainImage.alt = localStorage.getItem('site_language') === 'en'
                        ? 'Tahmisçi hero image'
                        : 'Tahmisçi hero görseli';
                    mainImage.loading = 'eager';
                    imagePanel.appendChild(mainImage);
                    mediaStage.appendChild(imagePanel);
                }

                if (productMediaUrl) {
                    const productMedia = document.createElement('figure');
                    productMedia.className = 'hero-product-media';
                    const productImage = document.createElement('img');
                    productImage.src = productMediaUrl;
                    productImage.alt = localStorage.getItem('site_language') === 'en'
                        ? 'Tahmisçi colorful cold drinks'
                        : 'Tahmisçi renkli soğuk içecekleri';
                    productImage.loading = 'eager';
                    if (productFallbackUrl) {
                        productImage.addEventListener('error', () => {
                            if (productImage.src !== productFallbackUrl) productImage.src = productFallbackUrl;
                        }, { once: true });
                    }
                    productMedia.appendChild(productImage);
                    mediaStage.appendChild(productMedia);
                }

                if (baristaMediaUrl) {
                    const baristaMedia = document.createElement('figure');
                    baristaMedia.className = 'hero-barista-media';
                    const baristaImage = document.createElement('img');
                    baristaImage.src = baristaMediaUrl;
                    baristaImage.alt = localStorage.getItem('site_language') === 'en'
                        ? 'Tahmisçi barista pouring milk into a cup'
                        : 'Fincana süt döken Tahmisçi baristası';
                    baristaImage.loading = 'eager';
                    if (baristaFallbackUrl) {
                        baristaImage.addEventListener('error', () => {
                            if (baristaImage.src !== baristaFallbackUrl) baristaImage.src = baristaFallbackUrl;
                        }, { once: true });
                    }
                    baristaMedia.appendChild(baristaImage);
                    mediaStage.appendChild(baristaMedia);
                }

                slideDiv.appendChild(mediaStage);
                slideDiv.classList.add('hero-slide--editorial');
            }
        }

        return slideDiv;
    }

    function updateSlider() {
        const sliderTrack = document.getElementById('heroSliderTrack');
        const dots = document.querySelectorAll('.hero-slider-dot');

        if (!sliderTrack) return;

        const slideWidth = 100;
        sliderTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;

        // Update dots
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        isTransitioning = false;
    }

    function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;

        const slides = APP_CONFIG.hero?.slides || [];
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
        startAutoplay();
    }

    function prevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;

        const slides = APP_CONFIG.hero?.slides || [];
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
        startAutoplay();
    }

    function goToSlide(index) {
        if (isTransitioning) return;
        isTransitioning = true;

        currentSlide = index;
        updateSlider();
        startAutoplay();
    }

    function startAutoplay() {
        stopAutoplay();

        if (document.body.classList.contains('tahmisci-static-menu')) return;
        if (!APP_CONFIG.hero?.autoplay) return;

        const interval = APP_CONFIG.hero.autoplayInterval || 5000;
        autoplayTimer = setInterval(() => {
            nextSlide();
        }, interval);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    // Pause autoplay on hover
    const sliderWrapper = document.querySelector('.hero-slider-wrapper');
    if (sliderWrapper) {
        sliderWrapper.addEventListener('mouseenter', stopAutoplay);
        sliderWrapper.addEventListener('mouseleave', startAutoplay);
    }

    // Initialize when DOM is ready or when hero data is loaded
    function initializeSlider() {
        if (APP_CONFIG && APP_CONFIG.hero && APP_CONFIG.hero.slides && APP_CONFIG.hero.slides.length > 0) {
            initHeroSlider();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSlider);
    } else {
        initializeSlider();
    }

    // Listen for hero data loaded event
    window.addEventListener('heroDataLoaded', initializeSlider);

    // Expose for external use
    window.HeroSlider = {
        next: nextSlide,
        prev: prevSlide,
        goTo: goToSlide,
        startAutoplay: startAutoplay,
        stopAutoplay: stopAutoplay
    };
})();


/**
 * Homepage Sections Manager
 * Section'ları aktif/pasif yapma ve yönetme sistemi
 */

class HomepageSectionsManager {
    constructor() {
        this.sections = {};
        this.init();
    }

    init() {
        // Tüm section'ları bul ve kaydet
        const sections = document.querySelectorAll('.homepage-section[data-section]');

        sections.forEach(section => {
            const sectionName = section.getAttribute('data-section');
            const isActive = section.getAttribute('data-active') === 'true';

            this.sections[sectionName] = {
                element: section,
                active: isActive
            };

            // Eğer pasifse gizle
            if (!isActive) {
                section.style.display = 'none';
            }
        });

        // LocalStorage'dan section durumlarını yükle
        this.loadSectionStates();
    }

    /**
     * Section'ı aktif/pasif yap
     * @param {string} sectionName - Section adı
     * @param {boolean} active - Aktif mi pasif mi
     */
    setSectionActive(sectionName, active) {
        if (!this.sections[sectionName]) {
            console.warn(`Section "${sectionName}" bulunamadı`);
            return;
        }

        const section = this.sections[sectionName];
        section.active = active;

        // DOM'da güncelle
        section.element.setAttribute('data-active', active.toString());

        if (active) {
            section.element.style.display = '';
        } else {
            section.element.style.display = 'none';
        }

        // LocalStorage'a kaydet
        this.saveSectionStates();
    }

    /**
     * Section durumunu al
     * @param {string} sectionName - Section adı
     * @returns {boolean} - Aktif mi?
     */
    isSectionActive(sectionName) {
        if (!this.sections[sectionName]) {
            return false;
        }
        return this.sections[sectionName].active;
    }

    /**
     * Tüm section durumlarını kaydet
     */
    saveSectionStates() {
        const states = {};

        Object.keys(this.sections).forEach(sectionName => {
            states[sectionName] = this.sections[sectionName].active;
        });

        try {
            localStorage.setItem('homepage_sections', JSON.stringify(states));
        } catch (e) {
            console.error('Section durumları kaydedilemedi:', e);
        }
    }

    /**
     * LocalStorage'dan section durumlarını yükle
     */
    loadSectionStates() {
        try {
            const saved = localStorage.getItem('homepage_sections');
            if (saved) {
                const states = JSON.parse(saved);

                Object.keys(states).forEach(sectionName => {
                    if (this.sections[sectionName]) {
                        this.setSectionActive(sectionName, states[sectionName]);
                    }
                });
            }
        } catch (e) {
            console.error('Section durumları yüklenemedi:', e);
        }
    }

    /**
     * Tüm section'ları göster
     */
    showAllSections() {
        Object.keys(this.sections).forEach(sectionName => {
            this.setSectionActive(sectionName, true);
        });
    }

    /**
     * Tüm section'ları gizle
     */
    hideAllSections() {
        Object.keys(this.sections).forEach(sectionName => {
            this.setSectionActive(sectionName, false);
        });
    }

    /**
     * Section listesini al
     * @returns {Object} - Section bilgileri
     */
    getSections() {
        return Object.keys(this.sections).map(sectionName => ({
            name: sectionName,
            active: this.sections[sectionName].active,
            element: this.sections[sectionName].element
        }));
    }
}

// Global instance oluştur
window.HomepageSections = new HomepageSectionsManager();

// Kullanım örneği (admin paneli için):
// HomepageSections.setSectionActive('hero', false); // Hero section'ı gizle
// HomepageSections.setSectionActive('popular-products', true); // Popüler ürünleri göster


/**
 * Homepage Popular Products Loader
 * Popüler ürünleri ana sayfada slider olarak gösterir (menu.html yapısına uygun)
 */

(function () {
    'use strict';

    // Popüler ürünler: products-loader menu-products.php'den sadece popular=1 olanları doldurur.
    function getDemoProducts() {
        return Array.isArray(APP_CONFIG?.demo?.products?.items) ? APP_CONFIG.demo.products.items : [];
    }

    // Popüler ürünleri yükle (slider olarak)
    function loadPopularProducts() {
        const track = document.getElementById('productsSliderTrack');
        if (!track) return;

        // Güncel products'ı al
        const products = getDemoProducts();

        // Ürün kartlarını oluştur (menu.html yapısına uygun)
        track.innerHTML = products.map(product => createProductCard(product)).join('');

        // Slider'ı başlat
        initSlider();

        // Ürün kartlarına event listener ekle
        attachProductEvents();
    }

    // Ürün kartı HTML'i oluştur (menu sayfasındaki yapıya birebir uygun)
    function createProductCard(product) {
        const image = String(product.image || '').trim();
        const isLogoFallback = product && product.image_source === 'company_logo';
        const hasImage = Boolean(image) && !isLogoFallback;
        const viewLabel = window.I18N?.t?.('product_action_view') || 'İncele';

        const badgeMap = {
            'popular': 'Çok Satan',
            'new': 'Yeni',
            'discount': 'İndirim',
            'healthy': 'Sağlıklı',
            'hot': 'Sıcak',
            'breakfast': 'Kahvaltı'
        };

        const badgeText = product.badge ? badgeMap[product.badge] || product.badge : null;
        const price = product.basePrice || product.price || 0;
        const priceLabel = String(product.priceLabel || '').trim() || `₺${parseFloat(price || 0).toLocaleString('tr-TR')}`;

        return `
      <div class="product-card product-card--featured${hasImage ? '' : ' product-card--no-media'}" data-product-id="${product.id}">
        ${hasImage ? `<div class="product-image">
          <img src="${image}" alt="${product.name || ''}" loading="lazy" class="${isLogoFallback ? 'logo-fallback-image' : ''}">
          ${badgeText ? `<div class="product-badge">${badgeText}</div>` : ''}
        </div>` : ''}
        <div class="product-content">
          <div class="product-header">
            <h3 class="product-name">${product.name || ''}</h3>
          </div>
          <p class="product-description">${product.description || ''}</p>
          <div class="product-footer">
            <div class="product-price">
              <span class="current-price">${priceLabel}</span>
              ${product.oldPrice ? `<span class="old-price">${parseFloat(product.oldPrice || 0).toFixed(2)}</span>` : ''}
            </div>
            <button class="product-add-btn" data-product-id="${product.id}">${viewLabel}</button>
          </div>
        </div>
      </div>
    `;
    }

    // Slider'ı başlat
    function initSlider() {
        const track = document.getElementById('productsSliderTrack');
        const prevBtn = document.getElementById('sliderPrev');
        const nextBtn = document.getElementById('sliderNext');

        if (!track) return;

        let currentIndex = 0;
        let cardsPerView = getCardsPerView();
        let autoSlideInterval;

        function getCardsPerView() {
            if (window.innerWidth >= 1200) return 4;
            if (window.innerWidth >= 768) return 3;
            if (window.innerWidth >= 576) return 2;
            return 1;
        }

        function updateSlider() {
            cardsPerView = getCardsPerView();
            const firstCard = track.querySelector('.product-card');
            if (!firstCard) return;

            // Kart genişliğini ve margin'ini al
            const cardRect = firstCard.getBoundingClientRect();
            const cardWidth = cardRect.width;
            const cardStyle = window.getComputedStyle(firstCard);
            const marginRight = parseFloat(cardStyle.marginRight) || 1.5 * 16; // 1.5rem = 24px

            // Slider'ı kaydır
            const translateX = -currentIndex * (cardWidth + marginRight);
            track.style.transform = `translateX(${translateX}px)`;
        }

        // İlk yüklemede slider'ı ayarla
        setTimeout(() => {
            updateSlider();
        }, 100);

        function nextSlide() {
            const products = getDemoProducts();
            const maxIndex = Math.max(0, products.length - getCardsPerView());
            currentIndex = (currentIndex + 1) % (maxIndex + 1);
            updateSlider();
        }

        function prevSlide() {
            const products = getDemoProducts();
            const maxIndex = Math.max(0, products.length - getCardsPerView());
            currentIndex = (currentIndex - 1 + (maxIndex + 1)) % (maxIndex + 1);
            updateSlider();
        }

        function startAutoSlide() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        // Otomatik kaydırma başlat
        startAutoSlide();

        // Buton event'leri
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                clearInterval(autoSlideInterval);
                nextSlide();
                startAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                clearInterval(autoSlideInterval);
                prevSlide();
                startAutoSlide();
            });
        }

        // Responsive için yeniden hesapla
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                currentIndex = 0;
                updateSlider();
            }, 250);
        });

        // Mouse ile kaydırma desteği
        let startX = 0;
        let scrollLeft = 0;
        let isDragging = false;
        let startTransform = 0;

        track.addEventListener('mousedown', (e) => {
            // Butonlara tıklanırsa kaydırmayı engelle
            if (e.target.closest('.slider-nav-btn') || e.target.closest('button')) {
                return;
            }

            isDragging = true;
            startX = e.pageX;
            track.style.cursor = 'grabbing';
            track.style.transition = 'none'; // Kaydırma sırasında animasyonu kapat

            // Mevcut transform değerini al
            const transform = track.style.transform || 'translateX(0px)';
            const match = transform.match(/translateX\((-?\d+\.?\d*)px\)/);
            startTransform = match ? parseFloat(match[1]) : 0;

            clearInterval(autoSlideInterval);
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            e.preventDefault();
            const x = e.pageX;
            const walk = (startX - x) * 1.5; // Kaydırma hızı
            const newTransform = startTransform - walk;

            track.style.transform = `translateX(${newTransform}px)`;
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;

            isDragging = false;
            track.style.cursor = 'grab';
            track.style.transition = 'transform 0.5s ease'; // Animasyonu geri aç

            // Kaydırma miktarını kontrol et ve slide'a hizala
            const firstCard = track.querySelector('.product-card');
            if (firstCard) {
                const cardRect = firstCard.getBoundingClientRect();
                const cardWidth = cardRect.width;
                const cardStyle = window.getComputedStyle(firstCard);
                const marginRight = parseFloat(cardStyle.marginRight) || 1.5 * 16;

                const transform = track.style.transform || 'translateX(0px)';
                const match = transform.match(/translateX\((-?\d+\.?\d*)px\)/);
                const currentTransform = match ? parseFloat(match[1]) : 0;

                // En yakın slide pozisyonunu hesapla
                const slideWidth = cardWidth + marginRight;
                const newIndex = Math.round(-currentTransform / slideWidth);
                const products = getDemoProducts();
                const maxIndex = Math.max(0, products.length - getCardsPerView());
                currentIndex = Math.max(0, Math.min(newIndex, maxIndex));

                updateSlider();
            }

            startAutoSlide();
        });

        track.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                track.style.cursor = 'grab';
                track.style.transition = 'transform 0.5s ease';
                updateSlider();
                startAutoSlide();
            }
        });
    }

    // Ürün kartlarına event listener ekle
    function attachProductEvents() {
        const selectBtns = document.querySelectorAll('#productsSliderTrack .product-add-btn');

        selectBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const productId = parseInt(this.getAttribute('data-product-id'));

                // Modal aç
                if (typeof window.openProductModal === 'function') {
                    window.openProductModal(productId);
                }
            });
        });

        // Ürün kartına tıklama (modal aç)
        const productCards = document.querySelectorAll('#productsSliderTrack .product-card');
        productCards.forEach(card => {
            card.addEventListener('click', function (e) {
                // Butona tıklanmışsa işlem yapma
                if (e.target.closest('button')) return;

                const productId = parseInt(this.getAttribute('data-product-id'));
                if (typeof window.openProductModal === 'function') {
                    window.openProductModal(productId);
                }
            });
        });
    }

    var TESTIMONIAL_MAX_LEN = 120;

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // Müşteri yorumlarını yükle
    function loadTestimonials() {
        const grid = document.getElementById('testimonialsGrid');
        if (!grid) return;

        // PHP'den gelen testimonials verilerini kullan
        const testimonials = APP_CONFIG?.demo?.testimonials || [];

        if (testimonials.length === 0) return;

        grid.innerHTML = testimonials.map(testimonial => createTestimonialCard(testimonial)).join('');
    }

    // Testimonial "Tamamını gör" / "Daha az" (tek seferlik delegation)
    (function initTestimonialToggle() {
        if (window._testimonialToggleInited) return;
        window._testimonialToggleInited = true;
        document.body.addEventListener('click', function (e) {
            var btn = e.target.closest('#testimonialsGrid .testimonial-toggle');
            if (!btn) return;
            var wrap = btn.closest('.testimonial-text-wrap');
            if (!wrap) return;
            var full = wrap.getAttribute('data-full');
            var short = wrap.getAttribute('data-short');
            var inner = wrap.querySelector('.testimonial-text-inner');
            if (!inner) return;
            if (wrap.classList.contains('is-expanded')) {
                inner.innerHTML = short;
                btn.textContent = 'Tamamını gör';
                wrap.classList.remove('is-expanded');
            } else {
                inner.innerHTML = full;
                btn.textContent = 'Daha az';
                wrap.classList.add('is-expanded');
            }
        });
    })();

    // Yorum kartı HTML'i oluştur
    function createTestimonialCard(testimonial) {
        const rating = testimonial.rating || 5;
        const stars = '<span class="testimonial-star" aria-hidden="true"></span>'.repeat(rating);
        const avatarContent = (testimonial.avatarImage)
            ? `<img src="${testimonial.avatarImage}" alt="${(testimonial.name || '').replace(/"/g, '&quot;')}" loading="lazy">`
            : (testimonial.avatar || '');
        const rawText = testimonial.text || '';
        const escapedFull = '"' + escapeHtml(rawText) + '"';
        let textBlock;
        if (rawText.length <= TESTIMONIAL_MAX_LEN) {
            textBlock = '<p class="testimonial-text testimonial-text-wrap"><span class="testimonial-text-inner">' + escapedFull + '</span></p>';
        } else {
            const shortText = '"' + escapeHtml(rawText.slice(0, TESTIMONIAL_MAX_LEN)) + '..."';
            textBlock = '<p class="testimonial-text testimonial-text-wrap" data-short="' + escapeHtml(shortText) + '" data-full="' + escapeHtml(escapedFull) + '">' +
                '<span class="testimonial-text-inner">' + shortText + '</span> ' +
                '<button type="button" class="testimonial-toggle">Tamamını gör</button></p>';
        }
        const safeName = escapeHtml(testimonial.name || '');
        return `
      <article class="testimonial-card">
        <div class="testimonial-card-inner">
          <header class="testimonial-card-header">
            <div class="testimonial-avatar">${avatarContent}</div>
            <div class="testimonial-meta">
              <div class="testimonial-stars" aria-label="${rating} yıldız">${stars}</div>
              <p class="testimonial-author">${safeName}</p>
            </div>
          </header>
          <div class="testimonial-body">
            ${textBlock}
          </div>
        </div>
      </article>
    `;
    }

    // DOM yüklendiğinde çalıştır
    function initializeProducts() {
        loadPopularProducts();
        loadTestimonials();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeProducts);
    } else {
        initializeProducts();
    }

    // Listen for products data loaded event
    window.addEventListener('productsDataLoaded', () => {
        loadPopularProducts();
    });

    window.addEventListener('publicBootstrapUpdated', () => {
        loadPopularProducts();
    });

    // Listen for testimonials data loaded event
    window.addEventListener('testimonialsDataLoaded', () => {
        loadTestimonials();
    });

})();

/**
 * Homepage Product Modal Handler
 * Menu.html'deki modal yapısına uygun modal yönetimi
 */

(function () {
    'use strict';

    // Modal elementleri
    const modalOverlay = document.getElementById('productModalOverlay');
    const modalCloseBtn = document.getElementById('productModalClose');

    // Modal içerik elementleri
    const modalImage = document.getElementById('modalProductImage');
    const modalBadge = document.getElementById('modalProductBadge');
    const modalName = document.getElementById('modalProductName');
    const modalRating = document.getElementById('modalProductRating');
    const modalDescription = document.getElementById('modalProductDescription');
    const modalCurrentPrice = document.getElementById('modalCurrentPrice');
    const modalOldPriceTop = document.getElementById('modalOldPriceTop');
    const modalTotalPrice = document.getElementById('modalTotalPrice');
    const modalOldPrice = document.getElementById('modalOldPrice');
    const sizeOptionsContainer = document.getElementById('sizeOptions');
    const extraOptionsContainer = document.getElementById('extraOptions');
    const modalQuantity = document.getElementById('modalQuantity');
    const modalQuantityMinus = document.getElementById('modalQuantityMinus');
    const modalQuantityPlus = document.getElementById('modalQuantityPlus');
    const productNotes = document.getElementById('productNotes');
    const modalAddToCart = document.getElementById('modalAddToCart');

    // Mevcut ürün ve seçimler
    let currentProduct = null;
    let currentQuantity = 1;
    let basePrice = 0;
    let selectedOptions = {
        size: null,
        extras: []
    };

    const getProductById = (productId) => {
        if (window.MenuProducts && Array.isArray(window.MenuProducts)) {
            const product = window.MenuProducts.find(p => p.id === productId);
            if (product) {
                return {
                    ...product,
                    basePrice: product.basePrice || product.price,
                    price: product.basePrice || product.price
                };
            }
        }
        return undefined;
    };

    // Modal aç - Optimized for performance
    function openProductModal(productId) {
        // İlk önce modal'ı göster (DOM reflow'u azaltmak için)
        if (modalOverlay) {
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Show spinner immediately
        const modalImageSpinner = document.getElementById('modalImageLoadingSpinner');
        if (modalImageSpinner) {
            modalImageSpinner.style.display = 'flex';
        }

        // Ürünü bul
        const product = getProductById(productId);
        if (!product) {
            console.error('Ürün bulunamadı:', productId);
            if (modalOverlay) modalOverlay.classList.remove('active');
            if (modalImageSpinner) modalImageSpinner.style.display = 'none';
            return;
        }

        // State'i güncelle
        currentProduct = product;
        currentQuantity = 1;
        basePrice = product.basePrice || product.price;
        selectedOptions = { size: null, extras: [] };

        // Reset scroll position to top
        const modalInfo = document.querySelector(".product-modal-info");
        if (modalInfo) {
            modalInfo.scrollTop = 0;
        }

        // DOM işlemlerini requestAnimationFrame ile optimize et
        requestAnimationFrame(() => {
            // Modal içeriğini güncelle
            updateModalContent(product);

            // Formu sıfırla
            resetModalForm();

            // Fiyatı hesapla
            updatePrice();
        });
    }

    // Modal içeriğini güncelle - Optimized batch DOM updates
    function updateModalContent(product) {
        // Batch DOM updates to reduce reflows
        // 1. Text content updates (fast operations)
        if (modalName) modalName.textContent = product.name || '';
        if (modalDescription) modalDescription.textContent = product.description || '';

        if (modalRating) {
            const rating = product.rating || 4.5;
            const ratingCount = product.ratingCount || 0;
            modalRating.textContent = `${rating} (${ratingCount} değerlendirme)`;
        }

        // 2. Image update (defer loading with spinner)
        if (modalImage) {
            const modalImageSpinner = document.getElementById('modalImageLoadingSpinner');

            modalImage.alt = product.name || '';
            modalImage.classList.toggle("logo-fallback-image", product.image_source === "company_logo");

            // Reset image state
            modalImage.src = '';
            modalImage.classList.remove('loaded');
            modalImage.classList.add('lazy-image');

            // Show spinner
            if (modalImageSpinner) {
                modalImageSpinner.style.display = 'flex';
            }

            // Load image with lazy loading
            if (product.image) {
                const tempImg = new Image();

                tempImg.onload = () => {
                    if (modalImage) {
                        modalImage.src = product.image;
                        modalImage.classList.add('loaded');
                        modalImage.classList.remove('lazy-image');
                    }

                    // Hide spinner after image loads
                    if (modalImageSpinner) {
                        modalImageSpinner.style.display = 'none';
                    }
                };

                tempImg.onerror = () => {
                    // Hide spinner on error
                    if (modalImageSpinner) {
                        modalImageSpinner.style.display = 'none';
                    }
                    // Set placeholder image
                    if (modalImage) {
                        modalImage.src = "assets/images/brand/favicon.png";
                        modalImage.classList.remove('lazy-image');
                        modalImage.classList.add("logo-fallback-image");
                    }
                };

                // Start loading
                tempImg.src = product.image;
            } else {
                // No image, hide spinner
                if (modalImageSpinner) {
                    modalImageSpinner.style.display = 'none';
                }
                if (modalImage) {
                    modalImage.classList.remove('lazy-image');
                }
            }
        }

        // 3. Badge update (tükendi öncelikli)
        if (modalBadge) {
            const badgeText = product.product_qr_status === '2' ? 'Tükendi' : (product.badge === 'popular' ? 'Popüler' : product.badge === 'new' ? 'Yeni' : '');
            if (badgeText) {
                modalBadge.textContent = badgeText;
                modalBadge.style.display = 'block';
            } else {
                modalBadge.style.display = 'none';
            }
        }

        // 4. Price updates
        if (modalCurrentPrice) modalCurrentPrice.textContent = `${product.price}`;

        if (modalOldPriceTop) {
            if (product.oldPrice) {
                modalOldPriceTop.textContent = `${product.oldPrice}`;
                modalOldPriceTop.style.display = 'inline';
            } else {
                modalOldPriceTop.style.display = 'none';
            }
        }

        // 5. Options (these are heavier operations, do them last)
        updateRatingStars(product.rating || 4.5);
        updateSizeOptions(product.sizeOptions || []);
        updateExtraOptions(product.extraOptions || []);
    }

    // Rating stars güncelle
    function updateRatingStars(rating) {
        const ratingStars = document.querySelector('.rating-stars');
        if (!ratingStars) return;

        const stars = ratingStars.querySelectorAll('i');
        stars.forEach((star, index) => {
            if (index < Math.floor(rating)) {
                star.classList.add('fas');
                star.classList.remove('far');
            } else {
                star.classList.add('far');
                star.classList.remove('fas');
            }
        });
    }

    // Size options güncelle
    function updateSizeOptions(sizeOptions) {
        if (!sizeOptionsContainer) return;

        sizeOptionsContainer.innerHTML = '';

        if (sizeOptions.length === 0) {
            sizeOptionsContainer.parentElement.style.display = 'none';
            return;
        }

        sizeOptionsContainer.parentElement.style.display = 'block';

        sizeOptions.forEach((size, index) => {
            const sizeOption = document.createElement('label');
            sizeOption.className = 'option-choice';
            sizeOption.innerHTML = `
        <input type="radio" name="size" value="${size.name}" data-price="${size.price}" ${index === 1 || sizeOptions.length === 1 ? 'checked' : ''}>
        <div class="choice-content">
          <span class="choice-name">${size.name}</span>
          <span class="choice-price">${size.price > 0 ? '+' + size.price : '+0'}</span>
        </div>
      `;

            const input = sizeOption.querySelector('input');
            input.addEventListener('change', () => {
                if (input.checked) {
                    selectedOptions.size = { name: size.name, price: size.price };
                    updatePrice();
                }
            });

            if (index === 1 || (sizeOptions.length === 1 && index === 0)) {
                selectedOptions.size = { name: size.name, price: size.price };
            }

            sizeOptionsContainer.appendChild(sizeOption);
        });
    }

    // Extra options güncelle - Optimized with DocumentFragment
    function updateExtraOptions(extraOptions) {
        if (!extraOptionsContainer) return;

        // Use DocumentFragment for batch DOM insertion
        const fragment = document.createDocumentFragment();

        if (extraOptions.length === 0) {
            extraOptionsContainer.innerHTML = '';
            extraOptionsContainer.parentElement.style.display = 'none';
            return;
        }

        extraOptionsContainer.parentElement.style.display = 'block';

        extraOptions.forEach(extra => {
            const extraOption = document.createElement('label');
            extraOption.className = 'option-choice';
            extraOption.innerHTML = `
        <input type="checkbox" name="extra" value="${extra.name}" data-price="${extra.price}">
        <div class="choice-content">
          <span class="choice-name">${extra.name}</span>
          <span class="choice-price">+${extra.price}</span>
        </div>
      `;

            const input = extraOption.querySelector('input');
            input.addEventListener('change', () => {
                if (input.checked) {
                    selectedOptions.extras.push({ name: extra.name, price: extra.price });
                } else {
                    selectedOptions.extras = selectedOptions.extras.filter(e => e.name !== extra.name);
                }
                updatePrice();
            });

            fragment.appendChild(extraOption);
        });

        // Single DOM update instead of multiple
        extraOptionsContainer.innerHTML = '';
        extraOptionsContainer.appendChild(fragment);
    }

    // Formu sıfırla
    function resetModalForm() {
        if (modalQuantity) modalQuantity.textContent = '1';
        if (productNotes) productNotes.value = '';
        selectedOptions.extras = [];

        // Checkboxları sıfırla
        if (extraOptionsContainer) {
            const checkboxes = extraOptionsContainer.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = false);
        }
    }

    // Fiyat hesapla
    function updatePrice() {
        if (!currentProduct) return;

        let totalPrice = basePrice;

        // Size price ekle
        if (selectedOptions.size) {
            totalPrice += selectedOptions.size.price;
        }

        // Extras price ekle
        selectedOptions.extras.forEach(extra => {
            totalPrice += extra.price;
        });

        // Quantity ile çarp
        const finalPrice = totalPrice * currentQuantity;

        // Modal fiyatını güncelle
        if (modalTotalPrice) modalTotalPrice.textContent = `${finalPrice.toFixed(2)}`;

        if (modalOldPrice && currentProduct.oldPrice) {
            const oldTotalPrice = currentProduct.oldPrice * currentQuantity;
            modalOldPrice.textContent = `${oldTotalPrice.toFixed(2)}`;
            modalOldPrice.style.display = 'inline';
        } else if (modalOldPrice) {
            modalOldPrice.style.display = 'none';
        }
    }

    // Modal kapat
    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Event listeners
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Quantity controls
    if (modalQuantityMinus) {
        modalQuantityMinus.addEventListener('click', () => {
            if (currentQuantity > 1) {
                currentQuantity--;
                if (modalQuantity) modalQuantity.textContent = currentQuantity;
                updatePrice();
            }
        });
    }

    if (modalQuantityPlus) {
        modalQuantityPlus.addEventListener('click', () => {
            if (currentQuantity < 50) {
                currentQuantity++;
                if (modalQuantity) modalQuantity.textContent = currentQuantity;
                updatePrice();
            }
        });
    }

    // Add to cart
    if (modalAddToCart) {
        modalAddToCart.addEventListener('click', () => {
            if (!currentProduct) return;

            // Sepete ekleme işlemi (cart.js'deki sistemi kullan)
            // cart.js'deki addItem: addItem(product, quantity, options)
            if (window.Cart && typeof window.Cart.addItem === 'function') {
                // Toplam fiyatı hesapla (basePrice + size + extras)
                const totalPrice = basePrice +
                    (selectedOptions.size ? selectedOptions.size.price : 0) +
                    selectedOptions.extras.reduce((sum, e) => sum + e.price, 0);

                // Product objesi oluştur (cart.js'nin beklediği format)
                // cart.js içinde product.price kullanılıyor, bu yüzden totalPrice'ı price olarak gönderiyoruz
                const product = {
                    id: currentProduct.id,
                    name: currentProduct.name,
                    price: totalPrice, // Toplam fiyat (base + size + extras)
                    image: currentProduct.image || '',
                    category: currentProduct.category || null
                };

                // Options objesi oluştur (menu.js formatına uygun)
                const options = {
                    size: selectedOptions.size ? selectedOptions.size.name : null,
                    extras: selectedOptions.extras.map(e => e.name),
                    notes: productNotes ? productNotes.value : ''
                };

                // Cart.addItem çağır (product, quantity, options)
                const result = window.Cart.addItem(product, currentQuantity, options);

                if (result && result.success) {
                    // Modal'ı kapat
                    closeModal();
                }
                // Hata durumunda cart.js içindeki ToastManager zaten mesaj gösteriyor
            } else if (window.addToCart && typeof window.addToCart === 'function') {
                // Global addToCart fonksiyonu varsa kullan (cart.js'de tanımlı)
                const totalPrice = basePrice +
                    (selectedOptions.size ? selectedOptions.size.price : 0) +
                    selectedOptions.extras.reduce((sum, e) => sum + e.price, 0);

                const product = {
                    id: currentProduct.id,
                    name: currentProduct.name,
                    price: totalPrice,
                    image: currentProduct.image || '',
                    category: currentProduct.category || null
                };

                const options = {
                    size: selectedOptions.size ? selectedOptions.size.name : null,
                    extras: selectedOptions.extras.map(e => e.name),
                    notes: productNotes ? productNotes.value : ''
                };

                const result = window.addToCart(product, currentQuantity, options);
                if (result && result.success) {
                    closeModal();
                }
            } else {
                // Fallback: Console'a yazdır
                console.error('Cart sistemi bulunamadı. config.js, utils.js ve cart.js yüklü olmalı.');
                closeModal();
            }
        });
    }

    // Global function olarak export et
    window.openProductModal = openProductModal;

    // ESC tuşu ile kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

})();

// ========== AUTH MODAL FUNCTIONALITY ==========

(function () {
    'use strict';

    // Wait for DOM to be ready
    function initAuthModal() {
        // Modal elements
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');
        const loginModalClose = document.getElementById('loginModalClose');
        const registerModalClose = document.getElementById('registerModalClose');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const btnLogin = document.getElementById('btnLogin');
        const btnRegister = document.getElementById('btnRegister');
        const switchToRegister = document.getElementById('switchToRegister');
        const switchToLogin = document.getElementById('switchToLogin');

        // Open/Close Functions
        function openLoginModal() {
            if (loginModal) {
                loginModal.classList.add('active');
                document.body.classList.add('modal-open');
                document.body.style.overflow = 'hidden';
                // Add header overlay active class
                const headerOverlay = document.getElementById('headerOverlay');
                if (headerOverlay) {
                    headerOverlay.classList.add('active');
                }
                // Focus on first input
                const firstInput = loginModal.querySelector('input');
                if (firstInput) setTimeout(() => firstInput.focus(), 100);
            }
        }

        function closeLoginModal() {
            if (loginModal) {
                loginModal.classList.remove('active');
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                // Remove header overlay active class
                const headerOverlay = document.getElementById('headerOverlay');
                if (headerOverlay) {
                    headerOverlay.classList.remove('active');
                }
                if (loginForm) loginForm.reset();
            }
        }

        function openRegisterModal() {
            if (registerModal) {
                registerModal.classList.add('active');
                document.body.classList.add('modal-open');
                document.body.style.overflow = 'hidden';
                // Add header overlay active class
                const headerOverlay = document.getElementById('headerOverlay');
                if (headerOverlay) {
                    headerOverlay.classList.add('active');
                }
                // Reset to step 1
                resetRegisterModal();
                // Focus on first input
                const firstInput = registerModal.querySelector('#registerPhone');
                if (firstInput) setTimeout(() => firstInput.focus(), 100);
            }
        }

        function closeRegisterModal() {
            if (registerModal) {
                registerModal.classList.remove('active');
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                // Remove header overlay active class
                const headerOverlay = document.getElementById('headerOverlay');
                if (headerOverlay) {
                    headerOverlay.classList.remove('active');
                }
                if (registerForm) registerForm.reset();
                resetRegisterModal();
            }
        }

        function openLegalDocModal(type) {
            var modal = document.getElementById('legalDocModal');
            var titleEl = document.getElementById('legalDocModalTitle');
            var contentEl = document.getElementById('legalDocModalContent');
            var loadingEl = document.getElementById('legalDocModalLoading');
            if (!modal || !titleEl || !contentEl || !loadingEl) return;
            var branchId = parseInt(localStorage.getItem('menuBranchId') || '0', 10) || 0;
            var companyId = typeof getRegisterCompanyId === 'function' ? getRegisterCompanyId() : (parseInt(localStorage.getItem('menuCompanyId') || localStorage.getItem('menuBranchId') || '48', 10)) || 48;
            var base = (typeof getSiteRoot === 'function' ? getSiteRoot() : (window.getSiteRoot && window.getSiteRoot())) || '';
            var endpoint = type === 'terms' ? 'terms-of-use.php' : 'disclosure-notice.php';
            var params = new URLSearchParams();
            if (branchId > 0) params.set('branch_id', branchId);
            if (companyId > 0) params.set('company_id', companyId);
            params.set('lang', (window.I18N && window.I18N.getPreferredLanguage && window.I18N.getPreferredLanguage()) || localStorage.getItem('site_language') || 'tr');
            modal.classList.add('active');
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
            titleEl.textContent = type === 'terms' ? (params.get('lang') === 'en' ? 'Terms of Use' : 'Kullanım Sözleşmesi') : (params.get('lang') === 'en' ? 'Privacy Notice' : 'Aydınlatma Metni');
            contentEl.innerHTML = '';
            loadingEl.style.display = 'block';
            fetch(base + '/yeppanel/db/ajax/web/' + endpoint + '?' + params.toString())
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    loadingEl.style.display = 'none';
                    if (data && data.success && data.title) {
                        titleEl.textContent = data.title;
                        contentEl.innerHTML = data.html || '';
                    } else {
                        contentEl.innerHTML = '<p>' + (params.get('lang') === 'en' ? 'Content could not be loaded.' : 'İçerik yüklenemedi.') + '</p>';
                    }
                })
                .catch(function () {
                    loadingEl.style.display = 'none';
                    contentEl.innerHTML = '<p>' + (params.get('lang') === 'en' ? 'Content could not be loaded.' : 'İçerik yüklenemedi.') + '</p>';
                });
        }

        function closeLegalDocModal() {
            var modal = document.getElementById('legalDocModal');
            if (modal) {
                modal.classList.remove('active');
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
            }
        }

        var legalDocModalClose = document.getElementById('legalDocModalClose');
        if (legalDocModalClose) legalDocModalClose.addEventListener('click', closeLegalDocModal);
        var legalDocModalFooterClose = document.getElementById('legalDocModalFooterClose');
        if (legalDocModalFooterClose) legalDocModalFooterClose.addEventListener('click', closeLegalDocModal);
        document.addEventListener('click', function (e) {
            if (e.target.id === 'legalDocModal' && e.target.classList.contains('legal-doc-modal-overlay')) closeLegalDocModal();
        });

        // Register Modal Step Management
        function resetRegisterModal() {
            const step1 = document.getElementById('registerStep1');
            const step2 = document.getElementById('registerStep2');
            if (step1) step1.style.display = 'block';
            if (step2) step2.style.display = 'none';
            // Reset code inputs
            const codeInputs = document.querySelectorAll('.verification-code-input');
            codeInputs.forEach(input => {
                input.value = '';
                input.classList.remove('error', 'success');
            });
        }

        function showRegisterStep2() {
            const step1 = document.getElementById('registerStep1');
            const step2 = document.getElementById('registerStep2');
            if (step1) step1.style.display = 'none';
            if (step2) step2.style.display = 'flex';
            // Focus first code input
            const firstCodeInput = document.querySelector('.verification-code-input');
            if (firstCodeInput) setTimeout(() => firstCodeInput.focus(), 100);
        }

        function showRegisterStep1() {
            const step1 = document.getElementById('registerStep1');
            const step2 = document.getElementById('registerStep2');
            if (step2) step2.style.display = 'none';
            if (step1) step1.style.display = 'block';
        }

        // Validation Functions
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        function cleanPhoneNumber(phone) {
            // Clean and format phone number to 10 digits without 0 or 90 prefix
            let cleaned = phone.replace(/\D/g, '');

            // Remove +90 or 90 prefix if present (12 digits: 90XXXXXXXXXX -> 10 digits: XXXXXXXXXX)
            if (cleaned.startsWith('90') && cleaned.length > 10) {
                cleaned = cleaned.substring(2);
            }

            // Remove leading 0
            if (cleaned.startsWith('0')) {
                cleaned = cleaned.substring(1);
            }

            // Limit to 10 digits
            cleaned = cleaned.substring(0, 10);

            return cleaned;
        }

        function validatePhone(phone) {
            // Turkish phone number validation (10 digits, cannot start with 0 or 90)
            const cleaned = cleanPhoneNumber(phone);

            // Must be exactly 10 digits
            if (cleaned.length !== 10) {
                return false;
            }

            // Cannot start with 0 or 90 (after cleaning)
            if (cleaned.startsWith('0') || cleaned.startsWith('90')) {
                return false;
            }

            return true;
        }

        function validateFirstName(name) {
            return name.trim().length >= 2;
        }

        function validateLastName(name) {
            return name.trim().length >= 2;
        }

        function validatePassword(password) {
            // Minimum 8 karakter
            return password.trim().length >= 8;
        }

        function validatePasswordMatch(password, confirmPassword) {
            return password === confirmPassword;
        }

        function showFieldError(input, message) {
            const formGroup = input.closest('.form-group');
            if (!formGroup) return;

            // Remove existing error
            const existingError = formGroup.querySelector('.field-error');
            if (existingError) existingError.remove();

            // Add error class
            input.classList.add('error');

            // Create error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            formGroup.appendChild(errorDiv);
        }

        function removeFieldError(input) {
            const formGroup = input.closest('.form-group');
            if (!formGroup) return;

            input.classList.remove('error');
            const existingError = formGroup.querySelector('.field-error');
            if (existingError) existingError.remove();
        }

        function validateRegisterForm() {
            const phone = document.getElementById('registerPhone');
            const firstName = document.getElementById('registerFirstName');
            const lastName = document.getElementById('registerLastName');
            const email = document.getElementById('registerEmail');
            const password = document.getElementById('registerPassword');
            const passwordConfirm = document.getElementById('registerPasswordConfirm');

            let isValid = true;

            // Validate phone
            if (!phone || !phone.value.trim()) {
                if (phone) showFieldError(phone, 'Telefon numarası gereklidir');
                isValid = false;
            } else {
                // Clean phone value before validation
                const cleanedValue = cleanPhoneNumber(phone.value);
                phone.value = cleanedValue;

                if (!validatePhone(phone.value)) {
                    const cleaned = phone.value.replace(/\D/g, '');
                    if (cleaned.length !== 10) {
                        showFieldError(phone, 'Telefon numarası 10 haneli olmalıdır');
                    } else if (cleaned.startsWith('0')) {
                        showFieldError(phone, 'Telefon numarası 0 ile başlayamaz');
                    } else if (cleaned.startsWith('90')) {
                        showFieldError(phone, 'Telefon numarası 90 ile başlayamaz');
                    } else {
                        showFieldError(phone, 'Geçerli bir telefon numarası giriniz');
                    }
                    isValid = false;
                } else {
                    removeFieldError(phone);
                }
            }

            // Validate first name
            if (!firstName || !firstName.value.trim()) {
                if (firstName) showFieldError(firstName, 'Ad gereklidir');
                isValid = false;
            } else if (!validateFirstName(firstName.value)) {
                showFieldError(firstName, 'Ad en az 2 karakter olmalıdır');
                isValid = false;
            } else {
                removeFieldError(firstName);
            }

            // Validate last name
            if (!lastName || !lastName.value.trim()) {
                if (lastName) showFieldError(lastName, 'Soyad gereklidir');
                isValid = false;
            } else if (!validateLastName(lastName.value)) {
                showFieldError(lastName, 'Soyad en az 2 karakter olmalıdır');
                isValid = false;
            } else {
                removeFieldError(lastName);
            }

            // Validate email
            if (!email || !email.value.trim()) {
                if (email) showFieldError(email, 'E-posta adresi gereklidir');
                isValid = false;
            } else if (!validateEmail(email.value)) {
                showFieldError(email, 'Geçerli bir e-posta adresi giriniz');
                isValid = false;
            } else {
                removeFieldError(email);
            }

            // Validate password
            if (!password || !password.value.trim()) {
                if (password) showFieldError(password, 'Şifre gereklidir');
                isValid = false;
            } else if (!validatePassword(password.value)) {
                showFieldError(password, 'Şifre en az 8 karakter olmalıdır');
                isValid = false;
            } else {
                removeFieldError(password);
            }

            // Validate password confirmation
            if (!passwordConfirm || !passwordConfirm.value.trim()) {
                if (passwordConfirm) showFieldError(passwordConfirm, 'Şifre tekrarı gereklidir');
                isValid = false;
            } else if (!validatePasswordMatch(password.value, passwordConfirm.value)) {
                showFieldError(passwordConfirm, 'Şifreler eşleşmiyor');
                isValid = false;
            } else {
                removeFieldError(passwordConfirm);
            }

            return isValid;
        }

        // Password toggle functionality
        function initPasswordToggles() {
            const loginPasswordToggle = document.getElementById('loginPasswordToggle');
            const loginPasswordInput = document.getElementById('loginPassword');
            const passwordToggle = document.getElementById('registerPasswordToggle');
            const passwordInput = document.getElementById('registerPassword');
            const passwordConfirmToggle = document.getElementById('registerPasswordConfirmToggle');
            const passwordConfirmInput = document.getElementById('registerPasswordConfirm');

            if (loginPasswordToggle && loginPasswordInput) {
                loginPasswordToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isPassword = loginPasswordInput.type === 'password';
                    loginPasswordInput.type = isPassword ? 'text' : 'password';
                    const icon = loginPasswordToggle.querySelector('i');
                    if (icon) {
                        icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
                    }
                });
            }

            if (passwordToggle && passwordInput) {
                passwordToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isPassword = passwordInput.type === 'password';
                    passwordInput.type = isPassword ? 'text' : 'password';
                    const icon = passwordToggle.querySelector('i');
                    if (icon) {
                        icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
                    }
                });
            }

            if (passwordConfirmToggle && passwordConfirmInput) {
                passwordConfirmToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isPassword = passwordConfirmInput.type === 'password';
                    passwordConfirmInput.type = isPassword ? 'text' : 'password';
                    const icon = passwordConfirmToggle.querySelector('i');
                    if (icon) {
                        icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
                    }
                });
            }
        }

        // Real-time validation
        if (registerForm) {
            const phoneInput = document.getElementById('registerPhone');
            const firstNameInput = document.getElementById('registerFirstName');
            const lastNameInput = document.getElementById('registerLastName');
            const emailInput = document.getElementById('registerEmail');
            const passwordInput = document.getElementById('registerPassword');
            const passwordConfirmInput = document.getElementById('registerPasswordConfirm');

            if (phoneInput) {
                // Format phone input (remove non-digits, remove 90/+90 prefix, remove leading 0, limit to 10 digits)
                phoneInput.addEventListener('input', (e) => {
                    let value = cleanPhoneNumber(e.target.value);
                    e.target.value = value;
                    // Remove error on input
                    if (phoneInput.classList.contains('error')) {
                        removeFieldError(phoneInput);
                    }
                });
                phoneInput.addEventListener('blur', () => {
                    if (phoneInput.value.trim()) {
                        // Clean and update the value
                        const cleanedValue = cleanPhoneNumber(phoneInput.value);
                        phoneInput.value = cleanedValue;

                        if (!validatePhone(phoneInput.value)) {
                            const cleaned = phoneInput.value.replace(/\D/g, '');
                            if (cleaned.length !== 10) {
                                showFieldError(phoneInput, 'Telefon numarası 10 haneli olmalıdır');
                            } else if (cleaned.startsWith('0')) {
                                showFieldError(phoneInput, 'Telefon numarası 0 ile başlayamaz');
                            } else if (cleaned.startsWith('90')) {
                                showFieldError(phoneInput, 'Telefon numarası 90 ile başlayamaz');
                            } else {
                                showFieldError(phoneInput, 'Geçerli bir telefon numarası giriniz');
                            }
                        } else {
                            removeFieldError(phoneInput);
                        }
                    }
                });
            }

            if (firstNameInput) {
                firstNameInput.addEventListener('blur', () => {
                    if (firstNameInput.value.trim()) {
                        if (!validateFirstName(firstNameInput.value)) {
                            showFieldError(firstNameInput, 'Ad en az 2 karakter olmalıdır');
                        } else {
                            removeFieldError(firstNameInput);
                        }
                    }
                });
                firstNameInput.addEventListener('input', () => {
                    if (firstNameInput.classList.contains('error')) {
                        removeFieldError(firstNameInput);
                    }
                });
            }

            if (lastNameInput) {
                lastNameInput.addEventListener('blur', () => {
                    if (lastNameInput.value.trim()) {
                        if (!validateLastName(lastNameInput.value)) {
                            showFieldError(lastNameInput, 'Soyad en az 2 karakter olmalıdır');
                        } else {
                            removeFieldError(lastNameInput);
                        }
                    }
                });
                lastNameInput.addEventListener('input', () => {
                    if (lastNameInput.classList.contains('error')) {
                        removeFieldError(lastNameInput);
                    }
                });
            }

            if (emailInput) {
                emailInput.addEventListener('blur', () => {
                    if (emailInput.value.trim()) {
                        if (!validateEmail(emailInput.value)) {
                            showFieldError(emailInput, 'Geçerli bir e-posta adresi giriniz');
                        } else {
                            removeFieldError(emailInput);
                        }
                    }
                });
                emailInput.addEventListener('input', () => {
                    if (emailInput.classList.contains('error')) {
                        removeFieldError(emailInput);
                    }
                });
            }

            if (passwordInput) {
                passwordInput.addEventListener('blur', () => {
                    if (passwordInput.value.trim()) {
                        if (!validatePassword(passwordInput.value)) {
                            showFieldError(passwordInput, 'Şifre en az 8 karakter olmalıdır');
                        } else {
                            removeFieldError(passwordInput);
                        }
                    }
                });
                passwordInput.addEventListener('input', () => {
                    if (passwordInput.classList.contains('error')) {
                        removeFieldError(passwordInput);
                    }
                    // Check password match on password change
                    if (passwordConfirmInput && passwordConfirmInput.value.trim()) {
                        if (!validatePasswordMatch(passwordInput.value, passwordConfirmInput.value)) {
                            showFieldError(passwordConfirmInput, 'Şifreler eşleşmiyor');
                        } else {
                            removeFieldError(passwordConfirmInput);
                        }
                    }
                });
            }

            if (passwordConfirmInput) {
                passwordConfirmInput.addEventListener('blur', () => {
                    if (passwordConfirmInput.value.trim()) {
                        if (!validatePasswordMatch(passwordInput.value, passwordConfirmInput.value)) {
                            showFieldError(passwordConfirmInput, 'Şifreler eşleşmiyor');
                        } else {
                            removeFieldError(passwordConfirmInput);
                        }
                    }
                });
                passwordConfirmInput.addEventListener('input', () => {
                    if (passwordConfirmInput.classList.contains('error')) {
                        removeFieldError(passwordConfirmInput);
                    }
                });
            }

            // Initialize password toggles
            initPasswordToggles();
        }

        // Register Form Submit
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                if (!validateRegisterForm()) {
                    if (window.ToastManager) {
                        window.showSwalToast('Lütfen tüm alanları doğru şekilde doldurun', 'error');
                    }
                    return;
                }

                let phone = document.getElementById('registerPhone').value;
                phone = cleanPhoneNumber(phone);
                const firstName = document.getElementById('registerFirstName').value.trim();
                const lastName = document.getElementById('registerLastName').value.trim();
                const email = document.getElementById('registerEmail').value.trim();
                const password = document.getElementById('registerPassword').value;
                const companyId = getRegisterCompanyId();
                const submitBtn = registerForm.querySelector('.btn-auth-submit');
                const originalBtnText = submitBtn ? submitBtn.textContent : '';

                const phoneInput = document.getElementById('registerPhone');
                if (phoneInput) phoneInput.value = phone;

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = (window.I18N && window.I18N.t ? window.I18N.t('loading') : 'Kontrol ediliyor...');
                }

                try {
                    const checkRes = await fetch(getSiteRoot() + '/yeppanel/db/ajax/web/register-check-email.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, company_id: companyId, lang: getAjaxLang() }),
                    });
                    const checkData = await checkRes.json();
                    if (!checkData.available) {
                        showSwalToast(checkData.message || 'Bu e-posta bu şubede zaten kayıtlı.', 'error');
                        const emailEl = document.getElementById('registerEmail');
                        if (emailEl) showFieldError(emailEl, checkData.message || '');
                        return;
                    }

                    if (submitBtn) submitBtn.textContent = (window.I18N && window.I18N.t ? window.I18N.t('verify_code_sending') : 'Kod gönderiliyor...');
                    const smsRes = await fetch(getSiteRoot() + '/yeppanel/db/ajax/web/send-sms-code.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone, company_id: companyId, lang: getAjaxLang() }),
                    });
                    const smsData = await smsRes.json();
                    if (!smsData.success) {
                        showSwalToast(smsData.message || 'SMS gönderilemedi.', 'error');
                        return;
                    }

                    const step2Phone = document.getElementById('step2Phone');
                    const step2Email = document.getElementById('step2Email');
                    if (step2Phone) step2Phone.textContent = phone;
                    if (step2Email) step2Email.textContent = email;
                    showRegisterStep2();
                } catch (err) {
                    showSwalToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
                } finally {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalBtnText;
                    }
                }
            });
        }

        // Back to Step 1 Button
        const backToStep1Btn = document.getElementById('backToStep1');
        if (backToStep1Btn) {
            backToStep1Btn.addEventListener('click', () => {
                showRegisterStep1();
            });
        }

        // Tekrar Kod Gönder (resend code) – üye ol 2. adım
        let registerResendCooldownUntil = 0;
        const resendCodeLink = document.getElementById('resendCode');
        if (resendCodeLink) {
            resendCodeLink.addEventListener('click', async (e) => {
                e.preventDefault();
                if (Date.now() < registerResendCooldownUntil) {
                    const sec = Math.ceil((registerResendCooldownUntil - Date.now()) / 1000);
                    showSwalToast('Lütfen ' + sec + ' saniye sonra tekrar deneyin.', 'warning');
                    return;
                }
                const phoneEl = document.getElementById('registerPhone');
                const phone = phoneEl ? cleanPhoneNumber(phoneEl.value) : '';
                if (!phone || phone.length !== 10) {
                    showSwalToast('Geçerli bir telefon numarası bulunamadı.', 'error');
                    return;
                }
                const companyId = getRegisterCompanyId();
                const linkText = resendCodeLink.textContent;
                resendCodeLink.textContent = (window.I18N && window.I18N.t ? window.I18N.t('loading') : 'Gönderiliyor...');
                resendCodeLink.style.pointerEvents = 'none';
                try {
                    const res = await fetch(getSiteRoot() + '/yeppanel/db/ajax/web/send-sms-code.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone, company_id: companyId, lang: getAjaxLang() }),
                    });
                    const data = await res.json();
                    if (data.success) {
                        showSwalToast(data.message || 'Kod tekrar gönderildi.', 'success');
                        registerResendCooldownUntil = Date.now() + 60000; // 60 sn cooldown
                    } else {
                        showSwalToast(data.message || 'Kod gönderilemedi.', 'error');
                    }
                } catch (err) {
                    showSwalToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
                } finally {
                    resendCodeLink.textContent = linkText;
                    resendCodeLink.style.pointerEvents = '';
                }
            });
        }

        // Verification Code Input Handling
        function initVerificationCode() {
            const codeInputs = document.querySelectorAll('.verification-code-input');
            const fillCodeDigits = (rawDigits, startIndex) => {
                const digits = String(rawDigits || '').replace(/\D/g, '').slice(0, 4);
                if (!digits) return;
                let cursor = startIndex;
                for (let i = 0; i < digits.length && cursor < codeInputs.length; i++) {
                    codeInputs[cursor].value = digits[i];
                    codeInputs[cursor].classList.remove('error', 'success');
                    cursor++;
                }
                const target = codeInputs[Math.min(cursor, codeInputs.length - 1)];
                if (target) target.focus();
            };

            codeInputs.forEach((input, index) => {
                // Only allow numbers
                input.addEventListener('input', (e) => {
                    const clean = e.target.value.replace(/\D/g, '');
                    if (clean.length > 1) {
                        e.target.value = '';
                        fillCodeDigits(clean, index);
                    } else {
                        e.target.value = clean.slice(0, 1);
                    }
                    removeFieldError(e.target);

                    // Auto-focus next input
                    if (e.target.value && index < codeInputs.length - 1) {
                        codeInputs[index + 1].focus();
                    }
                });

                // Handle backspace
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Backspace' && !e.target.value && index > 0) {
                        codeInputs[index - 1].focus();
                    }
                });

                // Handle paste
                input.addEventListener('paste', (e) => {
                    e.preventDefault();
                    const pastedData = e.clipboardData.getData('text');
                    fillCodeDigits(pastedData, index);
                });
            });
        }

        // Verification Code Submit (kayıt: kod + form verisi register.php'ye gider)
        const verifyCodeBtn = document.getElementById('verifyCodeBtn');
        if (verifyCodeBtn) {
            verifyCodeBtn.addEventListener('click', async (e) => {
                e.preventDefault();

                const registerModalEl = document.getElementById('registerModal');
                const codeInputs = registerModalEl ? registerModalEl.querySelectorAll('.verification-code-input') : document.querySelectorAll('.verification-code-input');
                const code = Array.from(codeInputs).map(input => input.value).join('');

                if (code.length !== 4) {
                    codeInputs.forEach(input => { input.classList.add('error'); });
                    showSwalToast('Lütfen 4 haneli kodu giriniz', 'error');
                    return;
                }

                const phoneEl = document.getElementById('registerPhone');
                const phone = phoneEl ? cleanPhoneNumber(phoneEl.value) : '';
                const email = document.getElementById('registerEmail') ? document.getElementById('registerEmail').value.trim() : '';
                const firstName = document.getElementById('registerFirstName') ? document.getElementById('registerFirstName').value.trim() : '';
                const lastName = document.getElementById('registerLastName') ? document.getElementById('registerLastName').value.trim() : '';
                const password = document.getElementById('registerPassword') ? document.getElementById('registerPassword').value : '';
                const companyId = getRegisterCompanyId();

                verifyCodeBtn.disabled = true;
                const originalText = verifyCodeBtn.textContent;
                verifyCodeBtn.textContent = (window.I18N && window.I18N.t ? window.I18N.t('loading') : 'Doğrulanıyor...');

                try {
                    const res = await fetch(getSiteRoot() + '/yeppanel/db/ajax/web/register.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email,
                            phone,
                            firstName,
                            lastName,
                            password,
                            code,
                            company_id: companyId,
                            lang: getAjaxLang(),
                        }),
                    });
                    const data = await res.json();
                    const lang = (typeof getAjaxLang === 'function' ? getAjaxLang() : 'tr') || 'tr';
                    const msg = (lang === 'en' && data.message_en) ? data.message_en : (data.message_tr || data.message || '');

                    if (data.success) {
                        codeInputs.forEach(input => { input.classList.remove('error'); input.classList.add('success'); });
                        showSwalToast(msg || 'Kayıt başarıyla tamamlandı!', 'success');
                        (async function autoLoginAfterRegister() {
                            try {
                                const loginRes = await fetch(getSiteRoot() + '/yeppanel/db/ajax/web/login.php', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ email, password, lang: getAjaxLang() }),
                                });
                                const loginData = await loginRes.json();
                                if (loginData.success && loginData.user) {
                                    localStorage.setItem('isLoggedIn', 'true');
                                    localStorage.setItem('userEmail', email);
                                    localStorage.setItem('userId', loginData.user.id || '');
                                    localStorage.setItem('userName', loginData.user.name || loginData.user.firstName || email.split('@')[0]);
                                    localStorage.setItem('userFirstName', loginData.user.firstName || '');
                                    localStorage.setItem('userLastName', loginData.user.lastName || '');
                                    localStorage.setItem('userPhone', loginData.user.phone || '');
                                    try { localStorage.removeItem('guestOrder'); } catch (e) { }
                                    if (typeof updateUIForLoginState === 'function') updateUIForLoginState(true, loginData.user || null);
                                    document.dispatchEvent(new CustomEvent('loginStateChanged', { detail: { isLoggedIn: true } }));
                                    window.location.reload();
                                }
                            } catch (e) { /* ignore */ }
                            closeRegisterModal();
                        })();
                    } else {
                        codeInputs.forEach(input => { input.classList.remove('success'); input.classList.add('error'); });
                        showSwalToast(msg || 'Hatalı kod veya işlem başarısız.', 'error');
                        codeInputs.forEach(input => { input.value = ''; });
                        if (codeInputs[0]) codeInputs[0].focus();
                    }
                } catch (err) {
                    showSwalToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
                } finally {
                    verifyCodeBtn.disabled = false;
                    verifyCodeBtn.textContent = originalText;
                }
            });
        }

        // Initialize verification code inputs when modal opens
        if (registerModal) {
            const observer = new MutationObserver(() => {
                if (registerModal.classList.contains('active')) {
                    initVerificationCode();
                }
            });
            observer.observe(registerModal, { attributes: true, attributeFilter: ['class'] });
            // Initial check
            if (registerModal.classList.contains('active')) {
                initVerificationCode();
            }
        }

        // Login Form Submit
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                const submitBtn = loginForm.querySelector('.btn-auth-submit');

                // Disable submit button during request
                if (submitBtn) {
                    submitBtn.disabled = true;
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Giriş yapılıyor...';

                    try {
                        const response = await fetch(getSiteRoot() + '/yeppanel/db/ajax/web/login.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, password, lang: getAjaxLang() })
                        });
                        const data = await response.json();
                        const success = data.success === true;
                        const translations = window.I18N?.getTranslations?.();
                        const lang = window.I18N?.getPreferredLanguage?.() || "tr";
                        const t = (key, fallback) =>
                            translations?.[lang]?.[key] !== undefined ? translations[lang][key] : fallback;

                        if (success) {
                            if (window.Swal && typeof window.Swal.fire === 'function') {
                                await window.Swal.fire({
                                    title: t("login_success_title", "Başarılı!"),
                                    text: t("login_success_message", "Giriş başarıyla yapıldı. Hoş geldiniz!"),
                                    icon: "success",
                                    confirmButtonText: t("back", "Tamam"),
                                    confirmButtonColor: "#8C734B",
                                    timer: 2000,
                                    timerProgressBar: true,
                                    toast: true,
                                    position: "top-end",
                                    showConfirmButton: false,
                                    width: "auto",
                                    padding: "1rem 1.5rem"
                                });
                            }

                            // Save login state to localStorage; misafir alışverişini kapat
                            localStorage.setItem('isLoggedIn', 'true');
                            localStorage.setItem('userEmail', email);
                            if (data.user) {
                                localStorage.setItem('userId', data.user.id || '1');
                                localStorage.setItem('userName', data.user.name || data.user.firstName || email.split('@')[0]);
                                localStorage.setItem('userFirstName', data.user.firstName || '');
                                localStorage.setItem('userLastName', data.user.lastName || '');
                                localStorage.setItem('userPhone', data.user.phone || '');
                            }
                            try { localStorage.removeItem('guestOrder'); } catch (e) { }

                            // Update UI immediately
                            updateUIForLoginState(true, data.user || null);
                            // Global login state event (sipariş sayfası vs. için)
                            document.dispatchEvent(new CustomEvent('loginStateChanged', {
                                detail: { isLoggedIn: true }
                            }));

                            // Close modal
                            closeLoginModal();

                            // Logout ile aynı davranış: mevcut sayfayı yenile.
                            window.location.reload();
                        } else {
                            const errorMessage = data.message || data.message_tr || 'Giriş başarısız. Lütfen tekrar deneyin.';
                            if (window.Swal && typeof window.Swal.fire === 'function') {
                                await window.Swal.fire({
                                    title: t("login_error_title", "Hata"),
                                    text: errorMessage,
                                    icon: "error",
                                    confirmButtonText: t("back", "Tamam"),
                                    confirmButtonColor: "#8C734B",
                                    timer: 3000,
                                    timerProgressBar: true,
                                    toast: true,
                                    position: "top-end",
                                    showConfirmButton: false
                                });
                            }
                        }
                    } catch (error) {
                        // Handle network or other errors
                        console.error('Login error:', error);
                        const translations = window.I18N?.getTranslations?.();
                        const lang = window.I18N?.getPreferredLanguage?.() || "tr";
                        const t = (key, fallback) =>
                            translations?.[lang]?.[key] !== undefined
                                ? translations[lang][key]
                                : fallback;

                        if (window.Swal && typeof window.Swal.fire === 'function') {
                            await window.Swal.fire({
                                title: t("login_error_title", "Hata"),
                                text: t("login_error_message", "Bir hata oluştu. Lütfen tekrar deneyin."),
                                icon: "error",
                                confirmButtonText: t("back", "Tamam"),
                                confirmButtonColor: "#8C734B",
                                timer: 3000,
                                timerProgressBar: true,
                                toast: true,
                                position: "top-end",
                                showConfirmButton: false
                            });
                        }
                    } finally {
                        // Re-enable submit button
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = originalText || 'Giriş Yap';
                        }
                    }
                }
            });
        }

        // Event Listeners - Use event delegation for dynamically loaded buttons
        function attachAuthButtonListeners() {
            const btnLogin = document.getElementById('btnLogin');
            const btnRegister = document.getElementById('btnRegister');

            if (btnLogin && !btnLogin.dataset.listenerAttached) {
                btnLogin.addEventListener('click', (e) => {
                    e.preventDefault();
                    openLoginModal();
                });
                btnLogin.dataset.listenerAttached = 'true';
            }

            if (btnRegister && !btnRegister.dataset.listenerAttached) {
                btnRegister.addEventListener('click', (e) => {
                    e.preventDefault();
                    openRegisterModal();
                });
                btnRegister.dataset.listenerAttached = 'true';
            }
        }

        // Use event delegation on document for dynamically loaded buttons
        // This ensures buttons work even if they're added to DOM after page load
        document.addEventListener('click', function (e) {
            const target = e.target;
            const btnLogin = document.getElementById('btnLogin');
            const btnRegister = document.getElementById('btnRegister');

            // Desktop login button
            if (btnLogin && (target === btnLogin || btnLogin.contains(target))) {
                e.preventDefault();
                e.stopPropagation();
                openLoginModal();
                return;
            }

            // Desktop register button
            if (btnRegister && (target === btnRegister || btnRegister.contains(target))) {
                e.preventDefault();
                e.stopPropagation();
                openRegisterModal();
                return;
            }
        }, true); // Use capture phase for better reliability

        // Attach listeners immediately (for static buttons)
        attachAuthButtonListeners();

        // Also expose function to re-attach after dynamic content loads
        window.attachAuthButtonListeners = attachAuthButtonListeners;

        if (loginModalClose) {
            loginModalClose.addEventListener('click', closeLoginModal);
        }

        if (registerModalClose) {
            registerModalClose.addEventListener('click', closeRegisterModal);
        }

        // Overlay click disabled - modal only closes via close button or Escape key
        // Removed overlay click to close functionality per user request

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (loginModal && loginModal.classList.contains('active')) {
                    closeLoginModal();
                }
                if (registerModal && registerModal.classList.contains('active')) {
                    closeRegisterModal();
                }
            }
        });

        // Misafir sipariş linki görünürlüğü (şube bazlı guestCheckoutEnabled)
        function updateGuestOrderLinkVisibility() {
            const data = window.HeaderData || {};
            const branches = data?.data?.app?.branches || data?.app?.branches || [];
            const branchId = localStorage.getItem('menuBranchId');
            const branch = branchId && branches.length ? branches.find(function (b) { return String(b.id) === String(branchId); }) : (branches[0] || null);
            const enabled = !!(branch && branch.guestCheckoutEnabled) || (branches.length && branches.some(function (b) { return b.guestCheckoutEnabled; }));
            const wrap = document.getElementById('guestOrderWrap');
            if (wrap) wrap.style.display = enabled ? 'block' : 'none';
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', updateGuestOrderLinkVisibility);
        } else {
            updateGuestOrderLinkVisibility();
        }
        document.addEventListener('headerDataLoaded', updateGuestOrderLinkVisibility);

        // Switch between login and register (delegated for dynamic i18n HTML)
        document.addEventListener('click', (e) => {
            const guestOrderLink = e.target.closest('#guestOrderLink');
            if (guestOrderLink) {
                e.preventDefault();
                try { localStorage.setItem('guestOrder', '1'); } catch (err) { }
                closeLoginModal();
                document.dispatchEvent(new CustomEvent('guestOrderStarted', { detail: {} }));
                return;
            }

            const registerLink = e.target.closest('#switchToRegister');
            if (registerLink) {
                e.preventDefault();
                closeLoginModal();
                setTimeout(() => openRegisterModal(), 200);
                return;
            }

            const loginLink = e.target.closest('#switchToLogin');
            if (loginLink) {
                e.preventDefault();
                closeRegisterModal();
                setTimeout(() => openLoginModal(), 200);
                return;
            }

            const legalLink = e.target.closest('a.legal-link[data-legal], a.order-phone-privacy-link[data-legal]');
            if (legalLink) {
                e.preventDefault();
                const type = legalLink.getAttribute('data-legal') || 'disclosure';
                if (type === 'terms' || type === 'disclosure') openLegalDocModal(type);
            }
        });

        // Mobile dropdown
        const mobileAuthDropdown = document.getElementById('mobileAuthDropdown');
        const mobileAuthTrigger = document.getElementById('mobileAuthTrigger');
        const mobileAuthMenu = document.getElementById('mobileAuthMenu');
        const mobileBtnLogin = document.getElementById('mobileBtnLogin');
        const mobileBtnRegister = document.getElementById('mobileBtnRegister');

        // Mobile dropdown toggle
        if (mobileAuthTrigger && mobileAuthDropdown) {
            mobileAuthTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileAuthDropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileAuthDropdown.contains(e.target) && !mobileAuthTrigger.contains(e.target)) {
                    mobileAuthDropdown.classList.remove('active');
                }
            });
        }

        if (mobileBtnLogin) {
            mobileBtnLogin.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (mobileAuthDropdown) mobileAuthDropdown.classList.remove('active');
                openLoginModal();
            });
        }

        if (mobileBtnRegister) {
            mobileBtnRegister.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (mobileAuthDropdown) mobileAuthDropdown.classList.remove('active');
                openRegisterModal();
            });
        }

        // Mobile menu auth buttons (inside mobile nav)
        const mobileMenuBtnLogin = document.getElementById('mobileMenuBtnLogin');
        const mobileMenuBtnRegister = document.getElementById('mobileMenuBtnRegister');

        if (mobileMenuBtnLogin) {
            mobileMenuBtnLogin.addEventListener('click', (e) => {
                e.preventDefault();
                // Close mobile menu by clicking close button
                const mobileNavClose = document.getElementById('mobileNavClose');
                if (mobileNavClose) {
                    mobileNavClose.click();
                }
                // Also manually close if click doesn't work
                const mobileNav = document.getElementById('mobileNav');
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
                // Open login modal
                setTimeout(() => openLoginModal(), 300);
            });
        }

        if (mobileMenuBtnRegister) {
            mobileMenuBtnRegister.addEventListener('click', (e) => {
                e.preventDefault();
                // Close mobile menu by clicking close button
                const mobileNavClose = document.getElementById('mobileNavClose');
                if (mobileNavClose) {
                    mobileNavClose.click();
                }
                // Also manually close if click doesn't work
                const mobileNav = document.getElementById('mobileNav');
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
                // Open register modal
                setTimeout(() => openRegisterModal(), 300);
            });
        }

        // User dropdown toggle
        const userBtn = document.getElementById('userBtn');
        const userDropdownMenu = document.getElementById('userDropdownMenu');

        if (userBtn && userDropdownMenu) {
            userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isActive = userDropdownMenu.style.display === 'block';
                userDropdownMenu.style.display = isActive ? 'none' : 'block';

                // Close on outside click
                if (!isActive) {
                    setTimeout(() => {
                        const closeDropdown = (e) => {
                            if (!userBtn.contains(e.target) && !userDropdownMenu.contains(e.target)) {
                                userDropdownMenu.style.display = 'none';
                                document.removeEventListener('click', closeDropdown);
                            }
                        };
                        setTimeout(() => document.addEventListener('click', closeDropdown), 0);
                    }, 0);
                }
            });
        }

        function clearClientLoginStorage() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('userFirstName');
            localStorage.removeItem('userLastName');
            localStorage.removeItem('userPhone');
        }

        function getSessionUserFromWindow() {
            const sessionUser = window.__yepSessionUser;
            if (!sessionUser || typeof sessionUser !== 'object') {
                return null;
            }
            const sessionUserId = Number(sessionUser.id || 0);
            if (!Number.isFinite(sessionUserId) || sessionUserId <= 0) {
                return null;
            }
            return sessionUser;
        }

        function persistClientUser(userData) {
            if (!userData || typeof userData !== 'object') {
                return;
            }
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userId', String(userData.id || ''));
            localStorage.setItem('userEmail', String(userData.email || ''));
            localStorage.setItem('userName', String(userData.name || userData.firstName || 'Müşteri'));
            localStorage.setItem('userFirstName', String(userData.firstName || ''));
            localStorage.setItem('userLastName', String(userData.lastName || ''));
            localStorage.setItem('userPhone', String(userData.phone || ''));
        }

        async function resolveServerLoginState() {
            if (isTahmisciBackendCatalogMode()) {
                clearClientLoginStorage();
                return { isLoggedIn: false, user: null };
            }
            const sessionUser = getSessionUserFromWindow();
            if (sessionUser) {
                persistClientUser(sessionUser);
                return { isLoggedIn: true, user: sessionUser };
            }

            try {
                const response = await fetch(getSiteRoot() + '/yeppanel/db/ajax/web/user-profile.php', {
                    method: 'GET',
                    credentials: 'same-origin',
                    cache: 'no-store'
                });
                if (!response.ok) {
                    return { isLoggedIn: false, user: null };
                }
                const payload = await response.json();
                if (payload && payload.success === true && payload.user && Number(payload.user.id || 0) > 0) {
                    persistClientUser(payload.user);
                    return { isLoggedIn: true, user: payload.user };
                }
                return { isLoggedIn: false, user: null };
            } catch (error) {
                return { isLoggedIn: false, user: null };
            }
        }

        // Logout button handler (Desktop & Mobile)
        const handleLogout = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Clear login state
            clearClientLoginStorage();
            window.__yepSessionUser = null;
            // Update UI
            updateUIForLoginState(false);
            // Global login state event
            document.dispatchEvent(new CustomEvent('loginStateChanged', {
                detail: { isLoggedIn: false }
            }));
            // Close mobile nav if open
            const mobileNav = document.getElementById('mobileNav');
            if (mobileNav) {
                mobileNav.classList.remove('active');
            }
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('active');
            }
            // Server session temizliği: sayfa değiştirmeden logout endpointini çağır.
            try {
                await fetch(getSiteRoot() + '/cikis.php?ajax=1', {
                    method: 'GET',
                    credentials: 'same-origin',
                    cache: 'no-store',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    }
                });
            } catch (error) {
                // Ağ hatasında da aynı sayfada kalıp mevcut state ile devam ederiz.
            }

            // Header + session bağımlı sayfa bölümlerinin doğru yüklenmesi için aynı sayfayı yenile.
            window.location.reload();
        };

        // Use event delegation for logout buttons (they may be dynamically added)
        document.addEventListener('click', (e) => {
            const logoutBtn = e.target.closest('#logoutBtn');
            const mobileLogoutBtn = e.target.closest('#mobileLogoutBtn');

            if (logoutBtn || mobileLogoutBtn) {
                handleLogout(e);
            }
        });

        // Also attach directly if elements exist (for immediate binding)
        const logoutBtn = document.getElementById('logoutBtn');
        const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');

        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
        if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener('click', handleLogout);
        }

        // Expose functions globally
        // Function to update UI based on login state
        function updateUIForLoginState(isLoggedIn, userData) {
            const authButtons = document.getElementById('authButtons');
            const userMenu = document.getElementById('userMenu');
            const mobileAuth = document.getElementById('mobileAuth');
            const mobileUserInfo = document.getElementById('mobileUserInfo');

            if (isLoggedIn) {
                const activeUser = (userData && typeof userData === 'object')
                    ? userData
                    : (getSessionUserFromWindow() || {
                        id: localStorage.getItem('userId') || '',
                        email: localStorage.getItem('userEmail') || '',
                        name: localStorage.getItem('userName') || 'Müşteri',
                        firstName: localStorage.getItem('userFirstName') || '',
                        lastName: localStorage.getItem('userLastName') || '',
                        phone: localStorage.getItem('userPhone') || ''
                    });
                persistClientUser(activeUser);
                if (!getSessionUserFromWindow()) {
                    window.__yepSessionUser = activeUser;
                }

                // Hide auth buttons, show user menu (always hidden on mobile via CSS)
                if (authButtons) {
                    authButtons.style.setProperty('display', 'none', 'important');
                }
                if (userMenu) {
                    userMenu.style.setProperty('display', 'flex', 'important');
                }
                // Hide mobile auth section when logged in (mobile nav)
                if (mobileAuth) {
                    mobileAuth.style.setProperty('display', 'none', 'important');
                }
                if (mobileUserInfo) {
                    mobileUserInfo.style.setProperty('display', 'block', 'important');
                }

                // Show mobile account nav content
                const mobileNavAccountContent = document.querySelector('.mobile-nav-account-content');
                if (mobileNavAccountContent) {
                    mobileNavAccountContent.style.setProperty('display', 'block', 'important');
                }

                // Show mobile profile menu, hide welcome
                const mobileUserMenu = document.getElementById('mobileUserMenu');
                const mobileUserWelcome = document.getElementById('mobileUserWelcome');
                if (mobileUserMenu) {
                    mobileUserMenu.style.display = 'flex';
                }
                if (mobileUserWelcome) {
                    mobileUserWelcome.style.display = 'none';
                }

                // Update display text: sadece name (ad), en fazla 10 karakter
                const userNameDisplay = document.getElementById('userNameDisplay');
                const userAvatar = document.getElementById('userAvatar');
                const userEmail = String(activeUser.email || '');
                const userFirstName = String(activeUser.firstName || '');
                const userName = String(activeUser.name || (userEmail ? userEmail.split('@')[0] : 'Müşteri'));
                const namePart = (userFirstName && userFirstName.trim()) ? userFirstName.trim() : (userName.trim().split(/\s+/)[0] || userName);
                const displayName = namePart.length > 10 ? namePart.substring(0, 10) : namePart;

                if (userNameDisplay) {
                    userNameDisplay.textContent = displayName;
                }
                // Header avatar: ikon yerine ad soyad baş harfleri (AÇ, YEP)
                if (userAvatar && (userName !== 'Müşteri' && userName)) {
                    const words = userName.trim().split(/\s+/).filter(Boolean);
                    const initials = words.slice(0, 3).map((w) => (w.charAt(0) || '')).join('').toUpperCase();
                    if (initials) {
                        userAvatar.innerHTML = '<span class="profile-menu-avatar-initials">' + initials + '</span>';
                    } else {
                        userAvatar.innerHTML = '<i class="fas fa-user"></i>';
                    }
                } else if (userAvatar) {
                    userAvatar.innerHTML = '<i class="fas fa-user"></i>';
                }
            } else {
                // Show auth buttons, hide user menu
                if (authButtons) {
                    // Only show on desktop (not mobile) - CSS already hides on mobile with !important
                    const isMobile = window.innerWidth < 992;
                    if (!isMobile) {
                        authButtons.style.setProperty('display', 'flex', 'important');
                    } else {
                        authButtons.style.setProperty('display', 'none', 'important');
                    }
                }
                if (userMenu) {
                    userMenu.style.setProperty('display', 'none', 'important');
                }
                const userAvatar = document.getElementById('userAvatar');
                if (userAvatar) {
                    userAvatar.innerHTML = '<i class="fas fa-user"></i>';
                }
                // Show mobile auth section when logged out (mobile nav)
                if (mobileAuth) {
                    mobileAuth.style.setProperty('display', 'flex', 'important');
                }
                if (mobileUserInfo) {
                    mobileUserInfo.style.setProperty('display', 'none', 'important');
                }

                // Hide mobile account nav content
                const mobileNavAccountContent = document.querySelector('.mobile-nav-account-content');
                if (mobileNavAccountContent) {
                    mobileNavAccountContent.style.setProperty('display', 'none', 'important');
                }

                // Hide mobile profile menu, show welcome
                const mobileUserMenu = document.getElementById('mobileUserMenu');
                const mobileUserWelcome = document.getElementById('mobileUserWelcome');
                if (mobileUserMenu) {
                    mobileUserMenu.style.display = 'none';
                }
                if (mobileUserWelcome) {
                    mobileUserWelcome.style.display = 'none';
                }
                window.__yepSessionUser = null;
                clearClientLoginStorage();
            }
        }

        // Oturum durumu her sayfa yüklemede server session üzerinden doğrulanır.
        resolveServerLoginState().then((state) => {
            if (!state.isLoggedIn) {
                clearClientLoginStorage();
                window.__yepSessionUser = null;
            }
            updateUIForLoginState(state.isLoggedIn, state.user);
        });

        window.openLoginModal = openLoginModal;
        window.closeLoginModal = closeLoginModal;
        window.openRegisterModal = openRegisterModal;
        window.closeRegisterModal = closeRegisterModal;
        window.openLegalDocModal = openLegalDocModal;
        window.closeLegalDocModal = closeLegalDocModal;
        window.updateUIForLoginState = updateUIForLoginState;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuthModal);
    } else {
        // DOM is already ready
        initAuthModal();
    }
})();

// ========== HEADER LOADER ==========
// Header verilerini PHP'den AJAX ile çeker ve HTML'e yükler

class HeaderLoader {
    constructor() {
        this.headerElement = null;
        this.mobileNavElement = null;
    }

    async loadHeader() {
        try {
            const provider = window.TahmisciPublicData;
            if (!provider) return;
            await provider.ready;
            const siteState = provider.getBootstrap()?.siteState || {};
            window.SITE_TITLE_BRAND = siteState.global?.siteName || 'Tahmisçi';
            window.HeaderData = { siteState };
            document.dispatchEvent(new CustomEvent('headerDataLoaded', { detail: window.HeaderData }));
        } catch (error) {
            console.error('Header yükleme hatası:', error);
        }
    }

    renderHeader(data) {
        if (!data.logo) return;
        const logoType = parseInt(data.logo.type, 10) || 0;
        const logoLink = data.logo.logoLink || './';
        const logoHeightRaw = data.logo.logoHeight || '20px';
        const logoHeightCss = /^\d+$/.test(String(logoHeightRaw).trim()) ? logoHeightRaw + 'px' : String(logoHeightRaw).trim();
        const esc = (s) => (s == null ? '' : String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'));
        const basePath = getSiteRoot();

        // Desktop Header Logo: type 0 = ikon+yazı, type 1 = resim (logoUrl)
        const headerLogo = document.querySelector('.header-logo .logo-link');
        if (headerLogo) {
            headerLogo.href = logoLink;
            if (logoType === 1 && data.logo.logoUrl) {
                let imgUrl = (data.logo.logoUrl || '').trim();
                if (imgUrl && !/^https?:\/\//i.test(imgUrl)) {
                    imgUrl = (basePath ? basePath + '/' : '') + imgUrl.replace(/^\//, '');
                }
                headerLogo.innerHTML = imgUrl
                    ? `<div class="logo-image-wrapper"><img src="${imgUrl.replace(/"/g, '&quot;')}" alt="${esc(data.logo.brandName)}" class="logo-image" style="height:${esc(logoHeightCss)}" loading="lazy"></div>`
                    : `<div class="logo-icon">${esc(data.logo.icon)}</div><div class="logo-text"><span class="brand-name">${esc(data.logo.brandName)}</span>${data.logo.tagline ? `<span class="brand-tagline">${esc(data.logo.tagline)}</span>` : ''}</div>`;
            } else {
                headerLogo.innerHTML = `<div class="logo-icon">${esc(data.logo.icon)}</div><div class="logo-text"><span class="brand-name">${esc(data.logo.brandName)}</span>${data.logo.tagline ? `<span class="brand-tagline">${esc(data.logo.tagline)}</span>` : ''}</div>`;
            }
            headerLogo.classList.add('logo-ready');
        }

        // Desktop Navigation
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && data.navigation) {
            navLinks.innerHTML = '';
            data.navigation.forEach(item => {
                const li = document.createElement('li');
                li.className = 'nav-item';
                const itemIcon = (item.icon && String(item.icon).trim()) ? `<i class="nav-link-icon ${String(item.icon).trim()}" aria-hidden="true"></i>` : '';

                // Check if item has dropdown
                if (item.dropdown && item.dropdown.length > 0) {
                    li.classList.add('has-dropdown');

                    const a = document.createElement('a');
                    a.href = item.url || '#';
                    a.className = 'nav-link';
                    a.innerHTML = itemIcon + ` <span class="nav-link-text">${esc(item.text)}</span> <i class="fas fa-chevron-down dropdown-icon" aria-hidden="true"></i>`;

                    const dropdown = document.createElement('div');
                    dropdown.className = 'nav-dropdown';

                    item.dropdown.forEach(subItem => {
                        const dropdownLink = document.createElement('a');
                        dropdownLink.href = subItem.url || '#';
                        dropdownLink.className = 'nav-dropdown-item';
                        const subIcon = (subItem.icon && String(subItem.icon).trim()) ? `<i class="nav-dropdown-item-icon ${String(subItem.icon).trim()}" aria-hidden="true"></i>` : '';
                        dropdownLink.innerHTML = subIcon ? subIcon + ' <span class="nav-dropdown-item-text">' + esc(subItem.text) + '</span>' : esc(subItem.text);
                        dropdown.appendChild(dropdownLink);
                    });

                    li.appendChild(a);
                    li.appendChild(dropdown);
                } else {
                    const a = document.createElement('a');
                    a.href = item.url || './';
                    a.className = 'nav-link';
                    a.innerHTML = itemIcon ? itemIcon + ' <span class="nav-link-text">' + esc(item.text) + '</span>' : esc(item.text);

                    li.appendChild(a);
                }

                navLinks.appendChild(li);
            });
        }

        // Mobile Navigation Logo: type 0 = ikon+yazı, type 1 = resim (logoUrl)
        const mobileNavLogo = document.querySelector('.mobile-nav-logo');
        if (mobileNavLogo) {
            mobileNavLogo.href = logoLink;
            if (logoType === 1 && data.logo.logoUrl) {
                let imgUrl = (data.logo.logoUrl || '').trim();
                if (imgUrl && !/^https?:\/\//i.test(imgUrl)) {
                    imgUrl = (basePath ? basePath + '/' : '') + imgUrl.replace(/^\//, '');
                }
                mobileNavLogo.innerHTML = imgUrl
                    ? `<div class="logo-image-wrapper"><img src="${imgUrl.replace(/"/g, '&quot;')}" alt="${esc(data.logo.brandName)}" class="logo-image" style="height:${esc(logoHeightCss)}" loading="lazy"></div>`
                    : `<div class="logo-icon">${esc(data.logo.icon)}</div><span class="brand-name">${esc(data.logo.brandName)}</span>`;
            } else {
                mobileNavLogo.innerHTML = `<div class="logo-icon">${esc(data.logo.icon)}</div><span class="brand-name">${esc(data.logo.brandName)}</span>`;
            }
            mobileNavLogo.classList.add('logo-ready');
        }

        // Mobile Navigation Menu Items
        const mobileNavContent = document.querySelector('.mobile-nav-content');
        if (mobileNavContent && data.navigation) {
            const mobileNavLinks = mobileNavContent.querySelector('.mobile-nav-links');
            if (mobileNavLinks) {
                mobileNavLinks.innerHTML = '';
                data.navigation.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'mobile-nav-item';
                    const itemIcon = (item.icon && String(item.icon).trim()) ? `<i class="mobile-nav-link-icon ${String(item.icon).trim()}" aria-hidden="true"></i>` : '';

                    // Check if item has dropdown
                    if (item.dropdown && item.dropdown.length > 0) {
                        li.classList.add('has-submenu');

                        const a = document.createElement('a');
                        a.href = '#';
                        a.className = 'mobile-nav-link';
                        a.innerHTML = (itemIcon ? itemIcon + ' ' : '') + `
                            <span class="mobile-nav-text">${esc(item.text)}</span>
                            <i class="fas fa-chevron-down mobile-nav-arrow" aria-hidden="true"></i>
                        `;

                        const submenu = document.createElement('div');
                        submenu.className = 'mobile-nav-submenu';

                        item.dropdown.forEach(subItem => {
                            const subLink = document.createElement('a');
                            subLink.href = subItem.url || '#';
                            subLink.className = 'mobile-nav-submenu-item';
                            const subIcon = (subItem.icon && String(subItem.icon).trim()) ? `<i class="mobile-nav-submenu-item-icon ${String(subItem.icon).trim()}" aria-hidden="true"></i>` : '';
                            subLink.innerHTML = subIcon ? subIcon + ' <span class="mobile-nav-submenu-item-text">' + esc(subItem.text) + '</span>' : esc(subItem.text);
                            submenu.appendChild(subLink);
                        });

                        li.appendChild(a);
                        li.appendChild(submenu);

                        // Toggle submenu on click
                        a.addEventListener('click', (e) => {
                            e.preventDefault();
                            li.classList.toggle('active');
                        });
                    } else {
                        const a = document.createElement('a');
                        a.href = item.url || './';
                        a.className = 'mobile-nav-link';
                        a.innerHTML = itemIcon ? itemIcon + ' <span class="mobile-nav-text">' + esc(item.text) + '</span>' : esc(item.text);

                        li.appendChild(a);
                    }

                    mobileNavLinks.appendChild(li);
                });
            }
        }

        // Set active nav link immediately after header is rendered
        if (typeof setActiveNavLink === 'function') {
            setActiveNavLink();
        }

        // Re-initialize language switcher after header is rendered
        if (window.languageSwitcher) {
            window.languageSwitcher.init();
        } else if (typeof LanguageSwitcher !== 'undefined') {
            window.languageSwitcher = new LanguageSwitcher();
        }

        // Re-initialize auth modal buttons after header is rendered
        // Use setTimeout to ensure DOM is fully updated
        setTimeout(() => {
            if (typeof window.attachAuthButtonListeners === 'function') {
                window.attachAuthButtonListeners();
            }
        }, 100);
    }

    applySiteConfig(cfg) {
        if (!cfg) return;
        const defLang = (cfg.default_language || 'tr').toLowerCase();
        const defTheme = (cfg.default_theme || 'default').trim();
        const elLang = document.getElementById('defaultlanguage');
        const elTheme = document.getElementById('defaultTheme');
        if (elLang) elLang.value = defLang;
        if (elTheme) elTheme.value = defTheme;
        if (!localStorage.getItem('site_language')) {
            localStorage.setItem('site_language', defLang);
        }
        const themeValue = defTheme;
        if (!themeValue) return;
        if (themeValue.startsWith('#')) {
            document.documentElement.style.setProperty('--color-primary', themeValue);
            const hexToRgb = (hex) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
            };
            const lighten = (hex, pct) => {
                const rgb = hexToRgb(hex);
                if (!rgb) return hex;
                const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * pct));
                const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * pct));
                const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * pct));
                return `rgb(${r}, ${g}, ${b})`;
            };
            const darken = (hex, pct) => {
                const rgb = hexToRgb(hex);
                if (!rgb) return hex;
                const r = Math.max(0, Math.round(rgb.r * (1 - pct)));
                const g = Math.max(0, Math.round(rgb.g * (1 - pct)));
                const b = Math.max(0, Math.round(rgb.b * (1 - pct)));
                return `rgb(${r}, ${g}, ${b})`;
            };
            const rgb = hexToRgb(themeValue);
            if (rgb) {
                document.documentElement.style.setProperty('--color-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
                document.documentElement.style.setProperty('--color-primary-light', lighten(themeValue, 0.3));
                document.documentElement.style.setProperty('--color-primary-dark', darken(themeValue, 0.15));
            }
        } else {
            document.documentElement.setAttribute('data-theme', themeValue);
        }
        if (cfg.primary_color && !themeValue.startsWith('#')) {
            document.documentElement.style.setProperty('--color-primary', cfg.primary_color);
        }
        if (cfg.accent_color) {
            document.documentElement.style.setProperty('--color-primary-dark', cfg.accent_color);
            document.documentElement.style.setProperty('--color-primary-light', cfg.accent_color);
        }
        try {
            if (cfg.primary_color) localStorage.setItem('yep_theme_primary', cfg.primary_color);
            if (themeValue.startsWith('#')) localStorage.setItem('yep_theme_primary', themeValue);
            if (cfg.accent_color) localStorage.setItem('yep_theme_accent', cfg.accent_color);
            if (cfg.default_theme != null) localStorage.setItem('yep_default_theme', String(cfg.default_theme));
            if (cfg.logo_type != null) localStorage.setItem('yep_logo_type', String(cfg.logo_type));
            if (cfg.logo_image != null) localStorage.setItem('yep_logo_image', String(cfg.logo_image));
            if (cfg.logo_icon != null) localStorage.setItem('yep_logo_icon', String(cfg.logo_icon));
            if (cfg.logo_title != null) localStorage.setItem('yep_logo_title', String(cfg.logo_title));
            if (cfg.logo_tagline != null) localStorage.setItem('yep_logo_tagline', String(cfg.logo_tagline));
            if (cfg.logo_height != null) localStorage.setItem('yep_logo_height', String(cfg.logo_height));
            if (cfg.favicon_url != null) localStorage.setItem('yep_favicon_url', String(cfg.favicon_url));
        } catch (e) { }
        if (cfg.favicon_url) {
            applyFavicon(cfg.favicon_url);
        }
    }
}

function applyFavicon(url) {
    if (!url || typeof url !== 'string') return;
    const basePath = (typeof getSiteRoot === 'function' ? getSiteRoot() : (window.SITE_ROOT || '')) || '';
    const href = url.trim().match(/^https?:\/\//i) ? url : (basePath ? basePath + '/' : '') + url.replace(/^\//, '');
    const ext = (href.split('?')[0].split('.').pop() || '').toLowerCase();
    const typeMap = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', ico: 'image/x-icon', svg: 'image/svg+xml' };
    const type = typeMap[ext] || 'image/x-icon';
    let link = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = href;
    link.type = type;
}

function applySiteConfigFromStorage() {
    try {
        const faviconUrl = localStorage.getItem('yep_favicon_url');
        if (faviconUrl) {
            applyFavicon(faviconUrl);
        }
        const hasStoredLogo = localStorage.getItem('yep_logo_type') != null || localStorage.getItem('yep_logo_icon') != null || localStorage.getItem('yep_logo_title') != null || localStorage.getItem('yep_logo_image') != null;
        if (!hasStoredLogo) return;

        const logoType = parseInt(localStorage.getItem('yep_logo_type'), 10);
        const logoIcon = localStorage.getItem('yep_logo_icon') || '';
        const logoTitle = localStorage.getItem('yep_logo_title') || 'YepPos';
        const logoTagline = localStorage.getItem('yep_logo_tagline') || '';
        const logoImage = localStorage.getItem('yep_logo_image') || '';
        const logoHeight = localStorage.getItem('yep_logo_height') || '32px';
        const logoHeightCss = /^\d+$/.test(String(logoHeight).trim()) ? logoHeight + 'px' : String(logoHeight).trim();
        const esc = (s) => (s == null ? '' : String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'));
        const basePath = (typeof getSiteRoot === 'function' ? getSiteRoot() : (window.SITE_ROOT || '')) || '';

        const headerLogo = document.querySelector('.header-logo .logo-link');
        if (headerLogo) {
            headerLogo.href = './';
            if (logoType === 1 && logoImage) {
                let imgUrl = logoImage.trim();
                if (imgUrl && !/^https?:\/\//i.test(imgUrl)) {
                    imgUrl = (basePath ? basePath + '/' : '') + imgUrl.replace(/^\//, '');
                }
                headerLogo.innerHTML = imgUrl
                    ? `<div class="logo-image-wrapper"><img src="${imgUrl.replace(/"/g, '&quot;')}" alt="${esc(logoTitle)}" class="logo-image" style="height:${esc(logoHeightCss)}" loading="lazy"></div>`
                    : `<div class="logo-icon">${esc(logoIcon)}</div><div class="logo-text"><span class="brand-name">${esc(logoTitle)}</span>${logoTagline ? `<span class="brand-tagline">${esc(logoTagline)}</span>` : ''}</div>`;
            } else {
                headerLogo.innerHTML = `<div class="logo-icon">${esc(logoIcon)}</div><div class="logo-text"><span class="brand-name">${esc(logoTitle)}</span>${logoTagline ? `<span class="brand-tagline">${esc(logoTagline)}</span>` : ''}</div>`;
            }
            headerLogo.classList.add('logo-ready');
        }
        const mobileNavLogo = document.querySelector('.mobile-nav-logo');
        if (mobileNavLogo) {
            mobileNavLogo.href = './';
            if (logoType === 1 && logoImage) {
                let imgUrl = logoImage.trim();
                if (imgUrl && !/^https?:\/\//i.test(imgUrl)) {
                    imgUrl = (basePath ? basePath + '/' : '') + imgUrl.replace(/^\//, '');
                }
                mobileNavLogo.innerHTML = imgUrl
                    ? `<div class="logo-image-wrapper"><img src="${imgUrl.replace(/"/g, '&quot;')}" alt="${esc(logoTitle)}" class="logo-image" style="height:${esc(logoHeightCss)}" loading="lazy"></div>`
                    : `<div class="logo-icon">${esc(logoIcon)}</div><span class="brand-name">${esc(logoTitle)}</span>`;
            } else {
                mobileNavLogo.innerHTML = `<div class="logo-icon">${esc(logoIcon)}</div><span class="brand-name">${esc(logoTitle)}</span>`;
            }
            mobileNavLogo.classList.add('logo-ready');
        }
    } catch (e) { }
}

// Sayfa yüklendiğinde önce localStorage'daki logo/tema uygula, sonra header'ı yükle
document.addEventListener('DOMContentLoaded', () => {
    if (typeof applySiteConfigFromStorage === 'function') {
        applySiteConfigFromStorage();
    }
    const headerLoader = new HeaderLoader();
    window.headerLoader = headerLoader;
    headerLoader.loadHeader();

    window.addEventListener('languageChanged', () => {
        headerLoader.loadHeader();
    });

    // PWA Service Worker
    const shouldRegisterServiceWorker =
        'serviceWorker' in navigator &&
        window.location.protocol === 'https:';
    if (shouldRegisterServiceWorker) {
        const base = (typeof getSiteRoot === 'function' ? getSiteRoot() : (window.getSiteRoot && window.getSiteRoot())) || '';
        navigator.serviceWorker.register(base + '/sw.js', { scope: base + '/' }).catch(function () { });
    }

    // Şube bazlı popup (panelden, yep_popups)
    initSitePopup();
});

function initSitePopup() {
    if (isTahmisciBackendCatalogMode()) return;
    const isReservationPage =
        document.body?.classList.contains("reservation-page") ||
        /(?:^|\/)(rezervasyon|reservation)(?:\.php)?\/?$/i.test(
            window.location.pathname || "",
        );
    if (isReservationPage) return;

    const base = (typeof getSiteRoot === 'function' ? getSiteRoot() : (window.getSiteRoot && window.getSiteRoot())) || '';
    const apiUrl = base + '/yeppanel/db/ajax/web/popup.php';
    const branchId = localStorage.getItem('menuBranchId');
    let url = apiUrl;
    if (branchId) url += (apiUrl.indexOf('?') !== -1 ? '&' : '?') + 'branch_id=' + encodeURIComponent(branchId);

    fetch(url)
        .then(function (r) { return r.json(); })
        .then(function (result) {
            if (!result.success || !result.data || !result.data.popup) return;
            var p = result.data.popup;
            var id = p.popups_id;
            var sessionKey = 'popup_shown_' + id;
            if (sessionStorage.getItem(sessionKey)) return;

            var delay = Math.max(0, parseInt(p.popups_must, 10) || 0) * 1000;
            setTimeout(function () {
                if (sessionStorage.getItem(sessionKey)) return;
                sessionStorage.setItem(sessionKey, '1');
                showSitePopup(p, base);
            }, delay);
        })
        .catch(function () { });
}

function showSitePopup(p, base) {
    const isReservationPage =
        document.body?.classList.contains("reservation-page") ||
        /(?:^|\/)(rezervasyon|reservation)(?:\.php)?\/?$/i.test(
            window.location.pathname || "",
        );
    if (isReservationPage) return;

    var overlay = document.getElementById('sitePopupOverlay');
    if (overlay) return;
    var imgPath = (p.popups_file && p.popups_file.trim()) ? (base + '/yeppanel/yep/yep_popups/' + p.popups_file.replace(/^\/+/, '')) : '';
    overlay = document.createElement('div');
    overlay.id = 'sitePopupOverlay';
    overlay.className = 'site-popup-overlay';
    var modal = document.createElement('div');
    modal.className = 'site-popup-modal';
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'site-popup-close';
    closeBtn.setAttribute('aria-label', 'Kapat');
    closeBtn.innerHTML = '&times;';
    var imageWrap = document.createElement('div');
    imageWrap.className = 'site-popup-image-wrap';
    if (imgPath) {
        var img = document.createElement('img');
        img.src = imgPath;
        img.alt = (p.popups_name || '').trim() || 'Popup';
        if ((p.popups_url || '').trim()) {
            var a = document.createElement('a');
            a.href = p.popups_url.trim();
            a.appendChild(img);
            imageWrap.appendChild(a);
        } else {
            imageWrap.appendChild(img);
        }
    }
    modal.appendChild(closeBtn);
    modal.appendChild(imageWrap);
    var body = document.createElement('div');
    body.className = 'site-popup-body';
    if ((p.popups_detail || '').trim()) {
        var detail = document.createElement('div');
        detail.className = 'site-popup-detail';
        detail.innerHTML = p.popups_detail.trim();
        body.appendChild(detail);
    }
    if ((p.popups_url || '').trim() && !imgPath) {
        var btnWrap = document.createElement('div');
        btnWrap.className = 'site-popup-btn-wrap';
        var link = document.createElement('a');
        link.href = p.popups_url.trim();
        link.className = 'site-popup-btn';
        link.textContent = 'Detay';
        btnWrap.appendChild(link);
        body.appendChild(btnWrap);
    }
    modal.appendChild(body);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    function closePopup() {
        overlay.classList.add('site-popup-hidden');
        document.body.style.overflow = '';
        setTimeout(function () {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 300);
    }
    closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closePopup();
    });
    document.addEventListener('keydown', function onEsc(e) {
        if (e.key === 'Escape') {
            closePopup();
            document.removeEventListener('keydown', onEsc);
        }
    });
}

// ========== HERO LOADER (hero.php'den slider verisi, DB'den) ==========
class HeroLoader {
    async loadHero() {
        try {
            const provider = window.TahmisciPublicData;
            if (!provider) throw new Error('Public veri sağlayıcısı bulunamadı.');
            await provider.ready;
            APP_CONFIG.hero.slides = Array.isArray(APP_CONFIG.hero.slides) ? APP_CONFIG.hero.slides : [];
            APP_CONFIG.hero.autoplay = APP_CONFIG.hero.autoplay !== false;
            APP_CONFIG.hero.autoplayInterval = APP_CONFIG.hero.autoplayInterval || 5000;
            APP_CONFIG.hero.transitionSpeed = APP_CONFIG.hero.transitionSpeed || 600;
            window.dispatchEvent(new CustomEvent('heroDataLoaded'));
        } catch (e) {
            console.error('Hero yükleme hatası:', e);
            APP_CONFIG.hero = APP_CONFIG.hero || {};
            APP_CONFIG.hero.slides = [];
            window.dispatchEvent(new CustomEvent('heroDataLoaded'));
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const heroLoader = new HeroLoader();
    window.tahmisciHeroLoader = heroLoader;
    heroLoader.loadHero();
    window.addEventListener('publicBootstrapUpdated', () => heroLoader.loadHero());
});

// ========== LANGUAGE SWITCHER ==========
class LanguageSwitcher {
    constructor() {
        this.currentLanguage = window.I18N?.getPreferredLanguage?.() || localStorage.getItem('site_language') || 'tr';
        this.languageBtn = document.getElementById('languageBtn');
        this.languageDropdown = document.getElementById('languageDropdown');
        this.currentLanguageSpan = document.getElementById('currentLanguage');
        this.mobileLanguageBtn = document.getElementById('mobileLanguageBtn');
        this.mobileLanguageDropdown = document.getElementById('mobileLanguageDropdown');
        this.mobileCurrentLanguageSpan = document.getElementById('mobileCurrentLanguage');
        this.init();
    }

    init() {
        // Set initial language from storage/default
        this.currentLanguage = window.I18N?.getPreferredLanguage?.() || localStorage.getItem('site_language') || 'tr';
        this.updateCurrentLanguageDisplay();
        this.updateActiveLanguage();

        // Desktop language switcher
        if (this.languageBtn && this.languageDropdown) {
            // Toggle dropdown
            this.languageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleDropdown();
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.languageBtn.contains(e.target) && !this.languageDropdown.contains(e.target)) {
                    this.closeDropdown();
                }
            });

            // Handle language selection
            const languageOptions = this.languageDropdown.querySelectorAll('.language-option');
            languageOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const lang = option.getAttribute('data-lang');
                    this.changeLanguage(lang);
                });
            });
        }

        // Mobile language switcher
        if (this.mobileLanguageBtn && this.mobileLanguageDropdown) {
            // Toggle dropdown
            this.mobileLanguageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileDropdown();
            });

            // Close dropdown when clicking outside (only on mobile)
            document.addEventListener('click', (e) => {
                if (!this.mobileLanguageBtn.contains(e.target) && !this.mobileLanguageDropdown.contains(e.target)) {
                    this.closeMobileDropdown();
                }
            });

            // Handle mobile language selection
            const mobileLanguageOptions = this.mobileLanguageDropdown.querySelectorAll('.mobile-language-option');
            mobileLanguageOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const lang = option.getAttribute('data-lang');
                    this.changeLanguage(lang);
                });
            });
        }

    }

    toggleDropdown() {
        if (!this.languageBtn) return;
        const switcher = this.languageBtn.closest('.language-switcher');
        if (switcher) {
            switcher.classList.toggle('active');
        }
    }

    closeDropdown() {
        const switcher = this.languageBtn?.closest('.language-switcher');
        if (switcher) {
            switcher.classList.remove('active');
        }
    }

    toggleMobileDropdown() {
        const switcher = this.mobileLanguageBtn?.closest('.mobile-language-switcher');
        if (switcher) {
            switcher.classList.toggle('active');
        }
    }

    closeMobileDropdown() {
        const switcher = this.mobileLanguageBtn?.closest('.mobile-language-switcher');
        if (switcher) {
            switcher.classList.remove('active');
        }
    }

    changeLanguage(lang) {
        if (lang === this.currentLanguage) {
            this.closeDropdown();
            this.closeMobileDropdown();
            return;
        }

        this.currentLanguage = lang;
        if (window.I18N && typeof window.I18N.setLanguage === 'function') {
            window.I18N.setLanguage(lang);
        } else {
            localStorage.setItem('site_language', lang);
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
        }

        // Update display
        this.updateCurrentLanguageDisplay();
        this.updateActiveLanguage();
        this.closeDropdown();
        this.closeMobileDropdown();
    }

    updateCurrentLanguageDisplay() {
        if (this.currentLanguageSpan) {
            this.currentLanguageSpan.textContent = this.currentLanguage.toUpperCase();
        }
        if (this.mobileCurrentLanguageSpan) {
            this.mobileCurrentLanguageSpan.textContent = this.currentLanguage.toUpperCase();
        }
    }

    updateActiveLanguage() {
        // Desktop language options
        const languageOptions = this.languageDropdown?.querySelectorAll('.language-option') || [];
        languageOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (lang === this.currentLanguage) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });

        // Mobile language options
        const mobileLanguageOptions = document.querySelectorAll('.mobile-language-option');
        mobileLanguageOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (lang === this.currentLanguage) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Initialize language switcher when DOM is ready
function initLanguageSwitcher() {
    if (!window.languageSwitcher) {
        window.languageSwitcher = new LanguageSwitcher();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
} else {
    initLanguageSwitcher();
}


// ========== MOBILE CONTACT ACTION SHEET ==========

(function () {
    'use strict';

    function initMobileContact() {
        const contactBtn = document.getElementById('mobileContactBtn');
        const contactOverlay = document.getElementById('mobileContactOverlay');
        const contactCancel = document.getElementById('mobileContactCancel');

        if (!contactBtn || !contactOverlay) return;

        // Open contact sheet
        contactBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            contactOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close contact sheet
        function closeContactSheet() {
            contactOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Close on cancel button
        if (contactCancel) {
            contactCancel.addEventListener('click', closeContactSheet);
        }

        // Close on overlay click
        contactOverlay.addEventListener('click', function (e) {
            if (e.target === contactOverlay) {
                closeContactSheet();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && contactOverlay.classList.contains('active')) {
                closeContactSheet();
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileContact);
    } else {
        initMobileContact();
    }
})();

// ========== MOBILE CART BUTTON HANDLER ==========
// Global mobile cart button handler for all pages

(function () {
    'use strict';

    function initMobileCartButton() {
        const mobileCartBtn = document.getElementById('mobileCartBtn');

        if (!mobileCartBtn) return;

        // Remove any existing listeners by cloning
        const newBtn = mobileCartBtn.cloneNode(true);
        mobileCartBtn.parentNode.replaceChild(newBtn, mobileCartBtn);

        // Add click listener
        newBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Try new cart modal first (if on menu page)
            if (window.menuPage && typeof window.menuPage.openNewCartModal === 'function') {
                window.menuPage.openNewCartModal();
            }
            // Fallback to old cart drawer system
            else if (window.globalCart && typeof window.globalCart.openCartDrawer === 'function') {
                window.globalCart.openCartDrawer();
            } else if (window.menuPage && typeof window.menuPage.openCartDrawer === 'function') {
                window.menuPage.openCartDrawer();
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileCartButton);
    } else {
        initMobileCartButton();
    }

    // Re-initialize after header loads (if header is loaded dynamically)
    window.addEventListener('headerLoaded', initMobileCartButton);
})();


// ========== FOOTER LOADER ==========
// Footer verilerini PHP'den AJAX ile çeker ve HTML'e yükler

class FooterLoader {
    async loadFooter() {
        try {
            const provider = window.TahmisciPublicData;
            if (!provider) return;
            await provider.ready;
            provider.apply(provider.getBootstrap(), 'footer');
        } catch (error) {
            console.error('Footer yükleme hatası:', error);
        }
    }

    renderFooter(data) {
        const footer = document.querySelector('.footer');
        if (!footer) return;

        // Logo ve Açıklama
        const footerLogo = footer.querySelector('.footer-logo h3');
        if (footerLogo && data.logo) {
            footerLogo.innerHTML = `${data.logo.icon} ${data.logo.brandName}`;
        }

        const footerDescription = footer.querySelector('.footer-description');
        if (footerDescription && data.description) {
            footerDescription.textContent = data.description;
        }

        // Sosyal Medya Linkleri
        const socialLinks = footer.querySelector('.social-links');
        if (socialLinks && data.socialLinks) {
            socialLinks.innerHTML = '';
            data.socialLinks.forEach(social => {
                const a = document.createElement('a');
                a.href = social.url;
                a.className = 'social-link';
                a.title = social.title;
                a.setAttribute('target', '_blank');
                a.setAttribute('rel', 'noopener noreferrer');
                a.innerHTML = `<i class="${social.icon}"></i>`;
                socialLinks.appendChild(a);
            });
        }

        // Hızlı Linkler
        const footerLinks = footer.querySelector('.footer-links');
        if (footerLinks && data.quickLinks) {
            footerLinks.innerHTML = '';
            data.quickLinks.forEach(link => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = link.url;
                a.textContent = link.text;
                li.appendChild(a);
                footerLinks.appendChild(li);
            });
        }

        // İletişim Bilgileri
        const contactSection = footer.querySelector('.footer-section:last-of-type');
        if (contactSection && data.contact) {
            // Title'ı koru
            const title = contactSection.querySelector('.footer-title');
            const contactContainer = contactSection.querySelector('.contact-item')?.parentElement || contactSection;

            // Sadece contact-item'ları temizle
            const existingItems = contactSection.querySelectorAll('.contact-item');
            existingItems.forEach(item => item.remove());

            data.contact.forEach(contact => {
                const div = document.createElement('div');
                div.className = 'contact-item';

                const icon = document.createElement('i');
                icon.className = contact.icon;

                const span = document.createElement('span');
                if (contact.url) {
                    const a = document.createElement('a');
                    a.href = contact.url;
                    a.textContent = contact.text;
                    if (contact.url.indexOf('http') === 0) {
                        a.target = '_blank';
                        a.rel = 'noopener noreferrer';
                    }
                    span.appendChild(a);
                } else {
                    span.textContent = contact.text;
                }

                div.appendChild(icon);
                div.appendChild(span);
                contactContainer.appendChild(div);
            });
        }

        // Footer Bottom (copyright API'dan HTML gelebilir; innerHTML kullan)
        const footerBottom = footer.querySelector('.footer-bottom-content');
        if (footerBottom && data.bottom) {
            const copyright = footerBottom.querySelector('p');
            if (copyright && data.bottom.copyright) {
                copyright.innerHTML = data.bottom.copyright;
            }

            const bottomLinks = footerBottom.querySelector('.footer-bottom-links');
            if (bottomLinks && data.bottom.links) {
                bottomLinks.innerHTML = '';
                data.bottom.links.forEach(link => {
                    const a = document.createElement('a');
                    a.href = link.url;
                    a.textContent = link.text;
                    if (link.url && link.url.indexOf('http') === 0) {
                        a.target = '_blank';
                        a.rel = 'noopener noreferrer';
                    }
                    bottomLinks.appendChild(a);
                });
            }
        }

        this.updateMobileContactOverlay(data);
    }

    updateMobileContactOverlay(data) {
        const container = document.getElementById('mobileContactOptions');
        if (!container) return;
        const t = (key, fallback) => (window.I18N && window.I18N.t ? window.I18N.t(key, fallback) : fallback);

        const contact = Array.isArray(data.contact) ? data.contact : [];
        const socialLinks = Array.isArray(data.socialLinks) ? data.socialLinks : [];
        const reviewUrl = data.reviewUrl || null;
        let waHref = (data.whatsappUrl && String(data.whatsappUrl).trim()) || '';

        const phoneItem = contact.find(c => c.type === 'phone');
        const emailItem = contact.find(c => c.type === 'email');
        const addressItem = contact.find(c => c.type === 'address');
        const instagramItem = socialLinks.find(s => (s.title || '').toLowerCase().indexOf('instagram') !== -1);
        const tiktokItem = socialLinks.find(s => (s.title || '').toLowerCase().indexOf('tiktok') !== -1);

        const phone = phoneItem ? (phoneItem.text || '').trim() : '';
        let phoneHref = phoneItem && phoneItem.url ? String(phoneItem.url).replace(/^tel:/i, '').trim() : '';
        if (phone && !phoneHref) {
            const digits = phone.replace(/\D/g, '');
            phoneHref = digits.length >= 10 ? (digits.startsWith('90') ? '+' + digits : '90' + digits.replace(/^0/, '')) : '';
            if (phoneHref && phoneHref.indexOf('+') !== 0) phoneHref = '+' + phoneHref;
        }
        if (!waHref && phoneHref) {
            const waNum = phoneHref.replace(/\D/g, '').replace(/^90/, '');
            waHref = waNum ? 'https://wa.me/90' + waNum : '';
        }

        const fragments = [];

        if (phone && phoneHref) {
            const a = document.createElement('a');
            a.href = 'tel:' + phoneHref.replace(/\s/g, '');
            a.className = 'mobile-contact-option';
            a.innerHTML = '<i class="fas fa-phone"></i><span>' + (t('contact_call', 'Ara') + ' ' + phone) + '</span>';
            fragments.push(a);
        }
        if (waHref) {
            const a = document.createElement('a');
            a.href = waHref;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.className = 'mobile-contact-option';
            a.innerHTML = '<i class="fab fa-whatsapp"></i><span>' + t('contact_whatsapp', "Whatsapp'tan Yaz") + '</span>';
            fragments.push(a);
        }
        if (emailItem && (emailItem.url || emailItem.text)) {
            const a = document.createElement('a');
            a.href = emailItem.url || ('mailto:' + (emailItem.text || '').trim());
            a.className = 'mobile-contact-option';
            a.innerHTML = '<i class="fas fa-envelope"></i><span>' + t('contact_email', 'E-posta Gönder') + '</span>';
            fragments.push(a);
        }
        if (addressItem && (addressItem.url || addressItem.text)) {
            const a = document.createElement('a');
            a.href = addressItem.url || ('https://www.google.com/maps?q=' + encodeURIComponent(addressItem.text || ''));
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.className = 'mobile-contact-option';
            a.innerHTML = '<i class="fas fa-map-marker-alt"></i><span>' + t('contact_location', 'Konuma Git') + '</span>';
            fragments.push(a);
        }
        if (instagramItem && instagramItem.url && instagramItem.url !== '#') {
            const a = document.createElement('a');
            a.href = instagramItem.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.className = 'mobile-contact-option';
            a.innerHTML = '<i class="fab fa-instagram"></i><span>' + t('contact_instagram', "Instagram'dan Takip Edin") + '</span>';
            fragments.push(a);
        }
        if (tiktokItem && tiktokItem.url && tiktokItem.url !== '#') {
            const a = document.createElement('a');
            a.href = tiktokItem.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.className = 'mobile-contact-option';
            a.innerHTML = '<i class="fab fa-tiktok"></i><span>TikTok</span>';
            fragments.push(a);
        }
        if (reviewUrl) {
            const a = document.createElement('a');
            a.href = reviewUrl;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.className = 'mobile-contact-option';
            a.innerHTML = '<i class="fab fa-google"></i><span>' + t('contact_review', 'Google Yorum Yap') + '</span>';
            fragments.push(a);
        }

        container.innerHTML = '';
        fragments.forEach(el => container.appendChild(el));
    }
}

// Sayfa yüklendiğinde footer'ı yükle
document.addEventListener('DOMContentLoaded', () => {
    const footerLoader = new FooterLoader();
    window.footerLoader = footerLoader;
    footerLoader.loadFooter();

    window.addEventListener('languageChanged', () => {
        footerLoader.loadFooter();
    });
});

// ========== MODERN MENU PAGE SCRIPT ==========

class ModernMenuPage {
    constructor() {
        // Products will be loaded from PHP via menu-products-loader.js
        this.products = window.MenuProducts || [];
        this.cart = [];
        this.currentProduct = null;
        this.currentProductOptions = {};
        this.currentQuantity = 1;
        this.basePrice = 0;
        this.appliedPromos = []; // Uygulanan promosyon listesi
        this.selectedCampaign = null; // Seçili kampanya
        this.selectedCampaignValidation = null; // { eligible: bool, reason: string } - backend doğrulama sonucu
        // Kampanya/kupon uyumluluk durumu
        this.appliedPromotions = [];
        this.appliedCampaigns = [];
        this.engineCampaignDiscountCents = 0;
        this.freeItems = [];
        this.couponAllowed = true;
        this.couponBlockReason = "";
        this.editingCartItemId = null; // Cart item being edited

        // Wait for products to load if not available yet
        if (this.products.length === 0) {
            document.addEventListener("menuProductsLoaded", () => {
                this.products = window.MenuProducts || [];
                this.init();
            });
        } else {
            this.init();
        }
    }

    init() {
        // Clean up any leftover fly-to-cart elements
        const leftoverFlyElements = document.querySelectorAll(".fly-to-cart-img");
        leftoverFlyElements.forEach((el) => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        // Initialize filter system
        this.initializeFilters();

        // Initialize search and sort
        this.initializeSearchAndSort();

        // Initialize sticky filter
        this.initializeStickyFilter();

        // Initialize dropdown filter
        this.initializeDropdownFilter();

        // Initialize modal system
        this.initializeProductModal();

        // Initialize new cart modal
        this.initializeNewCartModal();

        // Initialize favorites
        this.initializeFavorites();

        // Load cart from localStorage (start with empty cart)
        this.cart = [];
        this.loadCart();

        // Load promo from localStorage
        this.loadPromo();
        // Seçili kampanyayı yükle
        this.loadSelectedCampaign();

        // Kampanya motoru + kampanya listesi + global listener'lar sadece bir kez (tekrarlı AJAX önlenir)
        if (!this._promoCampaignsAndListenersDone) {
            this._promoCampaignsAndListenersDone = true;
            this.loadPromotionEngineState();
            this.initializeCampaigns();
            window.addEventListener("resize", () => {
                this.updateDesktopCartButtonPosition();
            });
            document.addEventListener("menuSelectionChanged", () => {
                this.updateDesktopCartButtonPosition();
                this.loadPromotionEngineState();
                this.updateCampaignSelectVisibility();
            });
        }

        // Update cart counter
        this.updateCartCounter();

        // SCROLL BASED CATEGORY
        this.initializeScrollBasedCategoryActivation();

        // Update desktop cart button position
        this.updateDesktopCartButtonPosition();
    }

    // ========== PRODUCT DATA ==========
    // Ürünler DB'den window.MenuProducts olarak gelir (menu-products-loader / PHP). Eski demo liste kaldırıldı.

    initializeProducts() {
        // Artık kullanılmıyor; ürünler constructor'da window.MenuProducts ile atanıyor.
        return;
    }

    // ========== FILTER SYSTEM ==========

    initializeFilters() {
        if (this._filtersDelegationBound) return;
        this._filtersDelegationBound = true;

        const filterCategories = document.querySelector(".filter-categories");
        const subWrapper = document.querySelector(".filter-subcategories-wrapper");
        const subContainer = document.querySelector(".filter-subcategories");
        const menuCategories = () => window.MenuCategories || [];

        if (filterCategories) {
            filterCategories.addEventListener("click", (e) => {
                if (filterCategories.dataset.dragJustEnded === '1') return;
                const btn = e.target.closest(".filter-categories .filter-btn:not(.dropdown-toggle)");
                if (!btn) return;
                const idStr = btn.dataset.category;
                const catId = idStr === "all" ? "all" : Number(idStr);
                const filterButtons = filterCategories.querySelectorAll(".filter-btn:not(.dropdown-toggle)");
                filterButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");

                const cat = menuCategories().find((c) => c.id === catId);
                if (window.TahmisciCatalog) {
                    if (subWrapper && subContainer) {
                        subWrapper.style.display = "none";
                        subContainer.innerHTML = "";
                    }
                    if (typeof window.loadMenuProductsForCategory === "function") {
                        window.loadMenuProductsForCategory(catId === "all" ? 0 : catId);
                    } else {
                        this.scrollToCategory(catId);
                    }
                    return;
                }
                if (cat && cat.subcategories && cat.subcategories.length > 0) {
                    if (subWrapper && subContainer) {
                        subWrapper.style.display = "";
                        document.querySelector(".menu-filters-sticky")?.classList.add("subcategories-visible");
                        subContainer.innerHTML = "";
                        const inner = document.createElement("div");
                        inner.className = "filter-subcategories-inner";
                        cat.subcategories.forEach((sub) => {
                            const subBtn = document.createElement("button");
                            subBtn.className = "filter-btn filter-sub-btn";
                            subBtn.setAttribute("data-category", String(sub.id));
                            subBtn.innerHTML = sub.icon
                                ? `<i class="${sub.icon}"></i> ${sub.name}`
                                : sub.name;
                            inner.appendChild(subBtn);
                        });
                        subContainer.appendChild(inner);
                    }
                    this.scrollToCategory(catId);
                } else {
                    if (subWrapper) {
                        subWrapper.style.display = "none";
                        document.querySelector(".menu-filters-sticky")?.classList.remove("subcategories-visible");
                    }
                    this.scrollToCategory(catId);
                }
            });
        }

        if (subWrapper) {
            subWrapper.addEventListener("click", (e) => {
                const subContainerForDrag = document.querySelector(".filter-subcategories");
                if (subContainerForDrag && subContainerForDrag.dataset.dragJustEnded === '1') return;
                const btn = e.target.closest(".filter-sub-btn");
                if (!btn) return;
                e.stopPropagation();
                const subBtns = subWrapper.querySelectorAll(".filter-sub-btn");
                subBtns.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                const catId = Number(btn.dataset.category);
                if (window.TahmisciCatalog && typeof window.loadMenuProductsForCategory === "function") {
                    window.loadMenuProductsForCategory(catId);
                } else {
                    this.scrollToCategory(catId);
                }
            });
        }
    }

    /**
     * Scroll to category section.
     * Desktop: window.scrollTo (mevcut davranış).
     * Mobile (<= 600px): yalnızca .main container içinde scroll.
     */
    scrollToCategory(category) {
        const isMobile = window.innerWidth <= 600;

        // "Tümü" için en üste dön
        if (category === "all") {
            if (isMobile) {
                const main = document.querySelector(".main");
                if (main) {
                    main.scrollTo({ top: 0, behavior: "smooth" });
                }
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
            return;
        }

        let targetCategory = category;
        let anchor = document.querySelector(
            '.category-anchor[data-category="' + category + '"]',
        );
        if (!anchor) {
            const menuCats = window.MenuCategories || [];
            const mainCategory = menuCats.find((c) => Number(c.id) === Number(category));
            const subcategories = Array.isArray(mainCategory?.subcategories) ? mainCategory.subcategories : [];
            for (const sub of subcategories) {
                anchor = document.querySelector(
                    '.category-anchor[data-category="' + String(sub.id) + '"]',
                );
                if (anchor) {
                    targetCategory = sub.id;
                    break;
                }
            }
        }
        if (!anchor) return;

        const menuCats = window.MenuCategories || [];
        const subcategoryIds = new Set();
        menuCats.forEach((c) => {
            if (c.subcategories) c.subcategories.forEach((s) => subcategoryIds.add(s.id));
        });
        const isSubcategory = subcategoryIds.has(Number(targetCategory));
        const titleExtra = isSubcategory ? 20 : 0;

        if (isMobile) {
            const main = document.querySelector(".main");
            const productsSection = document.querySelector(".products-section");
            if (!main || !productsSection) return;

            const mainRect = main.getBoundingClientRect();
            const anchorRect = anchor.getBoundingClientRect();
            const offsetInsideMain = 110 + titleExtra;
            const target =
                main.scrollTop + (anchorRect.top - mainRect.top) - offsetInsideMain;

            main.scrollTo({
                top: Math.max(0, target),
                behavior: "smooth",
            });
        } else {
            const header = document.querySelector(".header");
            const filterSticky = document.querySelector(".menu-filters-sticky");
            const offset =
                (header?.offsetHeight || 50) + (filterSticky?.offsetHeight || 60) + titleExtra;
            const top =
                anchor.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        }
    }

    // ========== STICKY FILTER SYSTEM ==========

    initializeStickyFilter() {
        const menuFiltersSection = document.getElementById("menuFilters");
        const header = document.querySelector(".header");

        if (!menuFiltersSection || !header) return;

        const headerHeight = header.offsetHeight;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        menuFiltersSection.classList.remove("sticky");
                    } else {
                        menuFiltersSection.classList.add("sticky");
                    }
                });
            },
            {
                threshold: 0,
                rootMargin: `-${headerHeight + 10}px 0px 0px 0px`,
            },
        );

        // Observe the element that comes before the filters
        const productsSection = document.querySelector(".products-section");
        if (productsSection) {
            observer.observe(productsSection);
        }

        // Mobilde scroll ile kategori aktif hale getirme
        this.initializeScrollBasedCategoryActivation();
    }

    // ========== SCROLL BASED CATEGORY ACTIVATION ==========

    initializeScrollBasedCategoryActivation() {
        const filterButtons = document.querySelectorAll(
            ".filter-btn[data-category]",
        );
        const filterCategories = document.querySelector(".filter-categories");
        const anchors = document.querySelectorAll(
            ".category-anchor[data-category]",
        );
        if (!filterButtons.length || !anchors.length) return;
        let lastActive = null;
        const menuCats = window.MenuCategories || [];
        const subToParent = new Map();
        menuCats.forEach((c) => {
            if (c.subcategories) c.subcategories.forEach((s) => subToParent.set(String(s.id), c.id));
        });
        const subWrapper = document.querySelector(".filter-subcategories-wrapper");
        const subContainer = document.querySelector(".filter-subcategories");
        let lastRenderedSubMainId = null;
        const scrollSubButtonIntoView = (subCategoryId) => {
            if (!subContainer || subCategoryId == null) return;
            const activeSubBtn = subContainer.querySelector(`.filter-sub-btn[data-category="${String(subCategoryId)}"]`);
            if (activeSubBtn && activeSubBtn.scrollIntoView) {
                activeSubBtn.scrollIntoView({
                    behavior: "smooth",
                    inline: "center",
                    block: "nearest",
                });
            }
        };

        const renderSubcategoriesForMain = (mainCategoryId, activeSubCategoryId = null) => {
            if (!subWrapper || !subContainer) return;
            if (window.TahmisciCatalog) {
                subWrapper.style.display = "none";
                subContainer.innerHTML = "";
                lastRenderedSubMainId = null;
                return;
            }
            const mainCat = menuCats.find((c) => Number(c.id) === Number(mainCategoryId));
            const hasSubs = !!(mainCat && Array.isArray(mainCat.subcategories) && mainCat.subcategories.length > 0);

            if (!hasSubs) {
                subWrapper.style.display = "none";
                subContainer.innerHTML = "";
                document.querySelector(".menu-filters-sticky")?.classList.remove("subcategories-visible");
                lastRenderedSubMainId = null;
                return;
            }

            // Aynı ana kategori için sadece aktif alt kategori state'ini güncelle.
            if (lastRenderedSubMainId === Number(mainCategoryId)) {
                const subBtns = subContainer.querySelectorAll(".filter-sub-btn");
                subBtns.forEach((btn) => {
                    const isActive = activeSubCategoryId != null && Number(btn.dataset.category) === Number(activeSubCategoryId);
                    btn.classList.toggle("active", !!isActive);
                });
                if (activeSubCategoryId != null) {
                    scrollSubButtonIntoView(activeSubCategoryId);
                }
                return;
            }

            subWrapper.style.display = "";
            document.querySelector(".menu-filters-sticky")?.classList.add("subcategories-visible");
            subContainer.innerHTML = "";
            const inner = document.createElement("div");
            inner.className = "filter-subcategories-inner";

            mainCat.subcategories.forEach((sub) => {
                const subBtn = document.createElement("button");
                subBtn.className = "filter-btn filter-sub-btn";
                subBtn.setAttribute("data-category", String(sub.id));
                subBtn.innerHTML = sub.icon ? `<i class="${sub.icon}"></i> ${sub.name}` : sub.name;
                if (activeSubCategoryId != null && Number(activeSubCategoryId) === Number(sub.id)) {
                    subBtn.classList.add("active");
                }
                inner.appendChild(subBtn);
            });

            subContainer.appendChild(inner);
            lastRenderedSubMainId = Number(mainCategoryId);
            if (activeSubCategoryId != null) {
                scrollSubButtonIntoView(activeSubCategoryId);
            }
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const category = entry.target.dataset.category;
                        if (lastActive !== category) {
                            lastActive = category;
                            const parentMainId = subToParent.get(category) || null;
                            filterButtons.forEach((btn) => {
                                const btnCat = btn.dataset.category;
                                const isParentOfCurrent = parentMainId != null && Number(btnCat) === parentMainId;
                                if (btnCat === category || isParentOfCurrent) {
                                    btn.classList.add("active");
                                    if (filterCategories && btn.scrollIntoView && (btnCat === category || isParentOfCurrent)) {
                                        btn.scrollIntoView({
                                            behavior: "smooth",
                                            inline: "center",
                                            block: "nearest",
                                        });
                                    }
                                } else {
                                    btn.classList.remove("active");
                                }
                            });

                            // Scroll ile aktif kategori değiştiğinde alt kategori şeridini de senkron tut.
                            if (parentMainId != null) {
                                renderSubcategoriesForMain(parentMainId, Number(category));
                            } else {
                                renderSubcategoriesForMain(Number(category), null);
                            }
                        }
                    }
                });
            },
            {
                root: null,
                rootMargin: "-100px 0px -60% 0px",
                threshold: 0.2,
            },
        );
        anchors.forEach((anchor) => observer.observe(anchor));
    }

    // ========== DROPDOWN FILTER ==========

    initializeDropdownFilter() {
        const moreCategoriesBtn = document.getElementById("moreCategoriesBtn");
        const moreCategoriesMenu = document.getElementById("moreCategoriesMenu");
        const filterDropdown = document.querySelector(".filter-dropdown");

        if (!moreCategoriesBtn || !moreCategoriesMenu || !filterDropdown) {
            return;
        }

        // Toggle function removed - logic moved to click event listener

        // Add click event listener
        moreCategoriesBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const isActive = filterDropdown.classList.contains("active");

            if (isActive) {
                filterDropdown.classList.remove("active");
            } else {
                filterDropdown.classList.add("active");
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (!filterDropdown.contains(e.target)) {
                filterDropdown.classList.remove("active");
            }
        });

        // Handle dropdown filter button clicks (id, has sub -> load + sub row; no sub -> scroll veya load all + scroll)
        const dropdownButtons = moreCategoriesMenu.querySelectorAll(".filter-btn");
        const menuCategories = window.MenuCategories || [];
        const subWrapper = document.querySelector(".filter-subcategories-wrapper");
        const subContainer = document.querySelector(".filter-subcategories");

        dropdownButtons.forEach((btn) => {
            const handleButtonClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const idStr = btn.dataset.category;
                const catId = Number(idStr);
                const mainFilterButtons = document.querySelectorAll(
                    ".filter-categories .filter-btn:not(.dropdown-toggle)",
                );
                mainFilterButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                filterDropdown.classList.remove("active");

                const cat = menuCategories.find((c) => c.id === catId);
                if (window.TahmisciCatalog) {
                    if (subWrapper && subContainer) {
                        subWrapper.style.display = "none";
                        subContainer.innerHTML = "";
                    }
                    if (typeof window.loadMenuProductsForCategory === "function") {
                        window.loadMenuProductsForCategory(catId);
                    } else {
                        this.scrollToCategory(catId);
                    }
                    return;
                }
                if (cat && cat.subcategories && cat.subcategories.length > 0) {
                    if (subWrapper && subContainer) {
                        subWrapper.style.display = "";
                        document.querySelector(".menu-filters-sticky")?.classList.add("subcategories-visible");
                        subContainer.innerHTML = "";
                        const inner = document.createElement("div");
                        inner.className = "filter-subcategories-inner";
                        cat.subcategories.forEach((sub) => {
                            const subBtn = document.createElement("button");
                            subBtn.className = "filter-btn filter-sub-btn";
                            subBtn.setAttribute("data-category", String(sub.id));
                            subBtn.innerHTML = sub.icon ? `<i class="${sub.icon}"></i> ${sub.name}` : sub.name;
                            inner.appendChild(subBtn);
                        });
                        subContainer.appendChild(inner);
                    }
                    this.scrollToCategory(catId);
                } else {
                    if (subWrapper) {
                        subWrapper.style.display = "none";
                        document.querySelector(".menu-filters-sticky")?.classList.remove("subcategories-visible");
                    }
                    this.scrollToCategory(catId);
                }
            };
            btn.addEventListener("click", handleButtonClick);
        });

        // Close dropdown on escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                filterDropdown.classList.remove("active");
            }
        });

        const backdrop = filterDropdown.querySelector(".filter-dropdown-backdrop");
        if (backdrop) {
            backdrop.addEventListener("click", () => {
                filterDropdown.classList.remove("active");
            });
        }

        // GLOBAL DAHA DROPDOWN MENU
        const globalMenu = document.getElementById("moreCategoriesMenuGlobal");
        if (moreCategoriesBtn && moreCategoriesMenu && globalMenu) {
            moreCategoriesBtn.addEventListener("click", (e) => {
                e.preventDefault();
                // Menü içeriğini taşı
                globalMenu.innerHTML = moreCategoriesMenu.innerHTML;
                globalMenu.classList.add("active");
                globalMenu.style.display = "block";

                // Butonun konumunu bul
                const btnRect = moreCategoriesBtn.getBoundingClientRect();
                globalMenu.style.top = btnRect.bottom + window.scrollY + "px";
                globalMenu.style.right = window.innerWidth - btnRect.right - 8 + "px"; // 8px sağ boşluk
                globalMenu.style.left = "auto";
            });
            // Dışarı tıklayınca kapat
            document.addEventListener("click", (e) => {
                if (!globalMenu.contains(e.target) && e.target !== moreCategoriesBtn) {
                    globalMenu.classList.remove("active");
                    globalMenu.style.display = "none";
                    globalMenu.style.top = "";
                    globalMenu.style.right = "";
                    globalMenu.style.left = "";
                }
            });
            // Menü içindeyken tıklama event'ini durdur
            globalMenu.addEventListener("click", (e) => {
                e.stopPropagation();
            });
        }
    }

    updateProductsCount(category, customCount = null) {
        const productsCount = document.getElementById("productsCount");
        const productsCategory = document.getElementById("productsCategory");

        if (!productsCount || !productsCategory) return;

        let visibleProducts;
        const totalProducts = document.querySelectorAll(".product-card").length;

        if (customCount !== null) {
            visibleProducts = customCount;
        } else {
            visibleProducts = document.querySelectorAll(
                '.product-card[style*="block"]',
            ).length;
        }

        if (category === "all" || category === null) {
            productsCount.textContent = `${visibleProducts} ürün`;
            productsCategory.textContent = "tüm kategoriler";
        } else {
            productsCount.textContent = `${visibleProducts} ürün`;
            productsCategory.textContent = category;
        }
    }

    // ========== SEARCH AND SORT SYSTEM ==========

    initializeSearchAndSort() {
        const searchInput = document.getElementById("productSearch");
        const sortSelect = document.getElementById("sortSelect");

        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                this.searchProducts(searchTerm);
            });
        }

        if (sortSelect) {
            sortSelect.addEventListener("change", (e) => {
                const sortBy = e.target.value;
                this.sortProducts(sortBy);
            });
        }
    }

    searchProducts(searchTerm) {
        const productCards = document.querySelectorAll("#productsGrid .product-card");
        const currentCategory = "all";

        let visibleCount = 0;

        productCards.forEach((card) => {
            const productCategory = card.dataset.category;
            const productName = card
                .querySelector(".product-name")
                .textContent.toLowerCase();
            const productDescription = card
                .querySelector(".product-description")
                .textContent.toLowerCase();

            // Check category filter
            const matchesCategory = true;

            // Check search filter
            const matchesSearch =
                searchTerm === "" ||
                productName.includes(searchTerm) ||
                productDescription.includes(searchTerm);

            if (matchesCategory && matchesSearch) {
                card.style.display = "flex";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        // Update products count
        this.updateProductsCount(currentCategory, visibleCount);
    }

    sortProducts(sortBy) {
        const productsGrid = document.getElementById("productsGrid");
        const compareCards = (a, b) => {
            const nameA = a.querySelector(".product-name").textContent.toLowerCase();
            const nameB = b.querySelector(".product-name").textContent.toLowerCase();

            const priceA = this.extractPrice(a);
            const priceB = this.extractPrice(b);

            switch (sortBy) {
                case "name":
                    return nameA.localeCompare(nameB);
                case "price-low":
                    return priceA - priceB;
                case "price-high":
                    return priceB - priceA;
                case "popular":
                    // Sort by badge presence (popular items have badges)
                    const badgeA = a.querySelector(".product-badge");
                    const badgeB = b.querySelector(".product-badge");
                    return (badgeB ? 1 : 0) - (badgeA ? 1 : 0);
                default:
                    return Number(a.dataset.productId) - Number(b.dataset.productId);
            }
        };

        productsGrid.querySelectorAll(".category-title").forEach((title) => {
            const cards = [];
            let next = title.nextElementSibling;
            while (next && next.classList.contains("product-card")) {
                cards.push(next);
                next = next.nextElementSibling;
            }
            cards.sort(compareCards).forEach((card) => productsGrid.insertBefore(card, next));
        });
    }

    extractPrice(card) {
        const currentPriceElement = card.querySelector(".current-price");
        if (currentPriceElement) {
            const priceText = currentPriceElement.textContent;
            const match = priceText.match(/\d+(?:[.,]\d+)?/);
            return match ? parseFloat(match[0].replace(",", ".")) : 0;
        }
        return 0;
    }

    // ========== PRODUCT MODAL SYSTEM ==========

    initializeProductModal() {
        // Modal elements
        this.productModalOverlay = document.getElementById("productModalOverlay");
        this.productModalClose = document.getElementById("productModalClose");
        this.modalQuantityMinus = document.getElementById("modalQuantityMinus");
        this.modalQuantityPlus = document.getElementById("modalQuantityPlus");
        this.modalQuantity = document.getElementById("modalQuantity");
        this.modalAddToCart = document.getElementById("modalAddToCart");
        this.modalTotalPrice = document.getElementById("modalTotalPrice");

        // Event listeners
        if (this.productModalClose) {
            this.productModalClose.addEventListener("click", () =>
                this.closeProductModal(),
            );
        }

        if (this.productModalOverlay) {
            this.productModalOverlay.addEventListener("click", (e) => {
                if (e.target === this.productModalOverlay) {
                    this.closeProductModal();
                }
            });
        }
        // Swipe-to-close: tüm modallar tek listeden, kod tekrarı yok
        if (typeof SwipeModalController !== "undefined" && SwipeModalController.registerModals) {
            SwipeModalController.registerModals([
                { overlay: "productModalOverlay", onClose: () => this.closeProductModal() },
                { overlay: "newCartModalOverlay", onClose: () => this.closeNewCartModal() },
                {
                    overlay: "campaignModal",
                    onClose: () => {
                        const m = document.getElementById("campaignModal");
                        if (m) {
                            m.classList.remove("active");
                            m.style.opacity = "";
                            const box = m.querySelector(".campaign-modal");
                            if (box) box.style.transform = "";
                        }
                    },
                },
            ]);
        }

        // Quantity controls - Remove existing listeners first to prevent duplicates
        if (this.modalQuantityMinus) {
            // Clone and replace to remove all event listeners
            const newMinusBtn = this.modalQuantityMinus.cloneNode(true);
            this.modalQuantityMinus.parentNode.replaceChild(
                newMinusBtn,
                this.modalQuantityMinus,
            );
            this.modalQuantityMinus = newMinusBtn;

            this.modalQuantityMinus.addEventListener("click", () =>
                this.changeQuantity(-1),
            );
        }

        if (this.modalQuantityPlus) {
            // Clone and replace to remove all event listeners
            const newPlusBtn = this.modalQuantityPlus.cloneNode(true);
            this.modalQuantityPlus.parentNode.replaceChild(
                newPlusBtn,
                this.modalQuantityPlus,
            );
            this.modalQuantityPlus = newPlusBtn;

            this.modalQuantityPlus.addEventListener("click", () =>
                this.changeQuantity(1),
            );
        }

        // Add to cart button
        if (this.modalAddToCart) {
            this.modalAddToCart.addEventListener("click", () =>
                this.addToCartFromModal(),
            );
        }

        // Option change listeners will be initialized after options are rendered

        // Nutrition button click handler
        const nutritionBtn = document.getElementById("modalNutritionBtn");
        const self = this;
        if (nutritionBtn) {
            nutritionBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.menuPage && window.menuPage.openNutritionTooltip) {
                    window.menuPage.openNutritionTooltip();
                } else if (self && self.openNutritionTooltip) {
                    self.openNutritionTooltip();
                }
            });
        } else {
            console.error("modalNutritionBtn not found");
        }

        // Nutrition tooltip close handlers
        const nutritionTooltipOverlay = document.getElementById(
            "nutritionTooltipOverlay",
        );
        const nutritionTooltipClose = document.getElementById(
            "nutritionTooltipClose",
        );

        if (nutritionTooltipOverlay) {
            nutritionTooltipOverlay.addEventListener("click", (e) => {
                if (e.target === nutritionTooltipOverlay) {
                    this.closeNutritionTooltip();
                }
            });
        }

        if (nutritionTooltipClose) {
            nutritionTooltipClose.addEventListener("click", () => {
                this.closeNutritionTooltip();
            });
        }
    }

    openNutritionTooltip() {
        const tooltipOverlay = document.getElementById("nutritionTooltipOverlay");
        const tooltipContent = document.getElementById("nutritionTooltipContent");

        if (!tooltipOverlay || !tooltipContent) {
            console.error("Nutrition tooltip elements not found");
            return;
        }

        if (!this.currentProduct) {
            console.error("No current product selected");
            return;
        }

        const nutritionData = this.getProductNutrition(this.currentProduct);
        if (!nutritionData.hasDetails) {
            return;
        }

        const translations = window.I18N?.getTranslations?.();
        const lang = window.I18N?.getPreferredLanguage?.() || "tr";
        const t = (key, fallback) =>
            translations?.[lang]?.[key] !== undefined
                ? translations[lang][key]
                : fallback;

        const subtitle = nutritionData.caloriesUnit
            ? `${this.escapeHtml(nutritionData.caloriesUnit)} ${this.escapeHtml(
                t("nutrition_subtitle_suffix", "başına besin değeri"),
            )}`
            : "";

        let rowsHtml = "";
        nutritionData.details.forEach((item) => {
            const valueText = this.formatNutritionDisplayValue(
                item.value,
                item.unit,
            );
            rowsHtml += `
            <div class="nutrition-value-row">
              <span class="nutrition-label">${this.escapeHtml(item.name)}</span>
              <span class="nutrition-value">${this.escapeHtml(valueText)}</span>
            </div>
          `;
        });

        const html = `
        <div class="nutrition-item">
          <h3 class="nutrition-item-title">${this.escapeHtml(this.currentProduct.name || t("nutrition_title", "Ürün"))}</h3>
          ${subtitle
                ? `<p class="nutrition-item-subtitle">${subtitle}</p>`
                : ""
            }
          <div class="nutrition-values">
            ${rowsHtml}
          </div>
        </div>
      `;

        tooltipContent.innerHTML = html;
        tooltipOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    closeNutritionTooltip() {
        const tooltipOverlay = document.getElementById("nutritionTooltipOverlay");
        if (tooltipOverlay) {
            tooltipOverlay.classList.remove("active");
        }
        // Only enable scroll if product modal is not open
        const productModal = document.getElementById("productModalOverlay");
        if (!productModal || !productModal.classList.contains("active")) {
            document.body.style.overflow = "";
        }
    }

    getProductNutrition(product) {
        const details = Array.isArray(product?.nutrition)
            ? product.nutrition
                .map((item) => ({
                    name: String(item?.name ?? "").trim(),
                    value: String(item?.value ?? "").trim(),
                    unit: String(item?.unit ?? "").trim(),
                    sort: Number(item?.sort ?? 0) || 0,
                }))
                .filter((item) => item.name !== "" && item.value !== "")
            : [];

        const calories = this.normalizeNutritionNumber(
            product?.products_branches_calories,
        );
        const caloriesUnit = String(
            product?.products_branches_calories_unit ?? "",
        ).trim();

        const caloriesNumeric = Number(calories.replace(",", "."));
        const hasCalories = Number.isFinite(caloriesNumeric) && caloriesNumeric > 0;

        return {
            calories,
            caloriesUnit,
            details,
            hasCalories,
            hasDetails: details.length > 0,
            hasAny: hasCalories || details.length > 0,
        };
    }

    normalizeNutritionNumber(value) {
        const raw = String(value ?? "").trim();
        if (raw === "") {
            return "";
        }

        const normalizedRaw = raw.replace(",", ".");
        const parsed = Number(normalizedRaw);
        if (!Number.isFinite(parsed)) {
            return raw;
        }

        return parsed.toFixed(2).replace(/\.?0+$/, "");
    }

    formatNutritionDisplayValue(value, unit) {
        const formattedValue = this.normalizeNutritionNumber(value);
        const unitText = String(unit ?? "").trim();
        if (formattedValue === "") {
            return unitText;
        }
        return unitText ? `${formattedValue} ${unitText}` : formattedValue;
    }

    formatTahmisciPriceLabel(product) {
        const variants = Array.isArray(product?.variants)
            ? product.variants.filter((item) => Number.isFinite(Number(item?.price)) && Number(item.price) > 0)
            : [];
        if (variants.length > 0) {
            return variants.map((item) => {
                const rawName = String(item.name || "").trim();
                let label = rawName.replace(String(product?.name || ""), "").trim() || rawName || "Fiyat";
                label = label
                    .replace(/^KÜÇÜK$/i, "K")
                    .replace(/^ORTA$/i, "O")
                    .replace(/^BÜYÜK$/i, "B");
                return `${label} ${this.formatPriceValue(item.price)}`;
            }).join(" | ");
        }
        const directPrice = Number(product?.basePrice || product?.price || 0);
        if (Number.isFinite(directPrice) && directPrice > 0) {
            return this.formatPriceValue(directPrice);
        }
        const priceLabel = String(product?.priceLabel || "").trim();
        return priceLabel && !priceLabel.includes("-") ? priceLabel : "";
    }

    formatPriceValue(value) {
        const amount = Number(value);
        if (!Number.isFinite(amount) || amount <= 0) return "";
        const clean = amount.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
        return `${clean}₺`;
    }

    updateNutritionActions(product) {
        const nutritionData = this.getProductNutrition(product || {});
        const nutritionBtn = document.getElementById("modalNutritionBtn");
        const calorieBadge = document.getElementById("modalCalorieBadge");
        const calorieValue = document.getElementById("modalCalorieValue");

        if (calorieBadge && calorieValue) {
            if (nutritionData.hasCalories) {
                calorieValue.textContent = nutritionData.calories;
                calorieBadge.style.display = "inline-flex";
            } else {
                calorieValue.textContent = "";
                calorieBadge.style.display = "none";
            }
        }

        if (nutritionBtn) {
            nutritionBtn.style.display = nutritionData.hasDetails
                ? "inline-flex"
                : "none";
        }

        return nutritionData;
    }

    renderTahmisciRecipeSummary(product) {
        if (!window.TahmisciCatalog) return;

        const modalDescription = document.getElementById("modalProductDescription");
        if (!modalDescription) return;

        let panel = document.getElementById("tahmisciRecipeSummary");
        if (!panel) {
            panel = document.createElement("div");
            panel.id = "tahmisciRecipeSummary";
            panel.className = "tahmisci-recipe-summary";
            modalDescription.insertAdjacentElement("afterend", panel);
        }

        const nutritionData = this.getProductNutrition(product || {});
        const details = nutritionData.details || [];
        const findDetail = (needle) => details.find((item) => {
            const key = String(item.name || "").toLocaleLowerCase("tr-TR");
            return key.includes(needle);
        });

        const contentItem = findDetail("reçete") || findDetail("icerik") || findDetail("içerik");
        const allergenItem = findDetail("alerjen");
        const content = contentItem
            ? this.formatNutritionDisplayValue(contentItem.value, contentItem.unit)
            : (product?.description || "Kaynakta tanımlı değil");
        const allergens = allergenItem
            ? this.formatNutritionDisplayValue(allergenItem.value, allergenItem.unit)
            : "Kaynakta tanımlı değil";
        const calories = nutritionData.hasCalories
            ? this.formatNutritionDisplayValue(nutritionData.calories, nutritionData.caloriesUnit || "kcal")
            : "Kaynakta tanımlı değil";

        panel.innerHTML = `
            <div class="tahmisci-recipe-summary-row">
                <strong>İçerik</strong>
                <span>${this.escapeHtml(content)}</span>
            </div>
            <div class="tahmisci-recipe-summary-row">
                <strong>Kalori</strong>
                <span>${this.escapeHtml(calories)}</span>
            </div>
            <div class="tahmisci-recipe-summary-row">
                <strong>Alerjen</strong>
                <span>${this.escapeHtml(allergens)}</span>
            </div>
        `;
    }

    initializeOptionListeners() {
        const container = document.getElementById("dynamicOptionsContainer");
        if (!container) return;

        // Eski dinleyicileri kaldır
        if (this.handleOptionChange) {
            container.removeEventListener("change", this.handleOptionChange);
        }
        if (this.handleOptionSearchClick) {
            container.removeEventListener("click", this.handleOptionSearchClick);
        }
        if (this.handleOptionSearchInput) {
            container.removeEventListener("input", this.handleOptionSearchInput);
        }
        if (this.handleOptionClick) {
            container.removeEventListener("click", this.handleOptionClick);
        }

        // 1) Opsiyon değişiklikleri (radio / checkbox)
        this.handleOptionChange = (e) => {
            if (e.target.type === "radio" || e.target.type === "checkbox") {
                // Optional radio + min=0 ise "Seçim yok" seçeneğini sadece seçim yapıldıktan sonra ekle
                this.syncNoneChoiceVisibility(e.target);
                this.updatePrice();

                // Radio/checkbox değiştiğinde her zaman alt opsiyonları kontrol et
                // (önceki seçimin alt opsiyonlarını temizlemek ve yeni seçimin alt opsiyonlarını göstermek için)
                if (e.target.type === "radio") {
                    this.handleSubOptionsToggle(e.target);
                } else if (e.target.type === "checkbox") {
                    // Checkbox için de aynı mantık: seçildiğinde alt opsiyonları kontrol et
                    this.handleSubOptionsToggle(e.target);
                }
            }
        };
        container.addEventListener("change", this.handleOptionChange);

        // 2) Arama butonu tıklaması
        this.handleOptionSearchClick = (e) => {
            const toggle = e.target.closest(".option-search-toggle");
            if (!toggle) return;

            const header = toggle.closest(".option-group-header");
            if (!header) return;

            const input = header.querySelector(".option-search-input");
            if (!input) return;

            const isActive = input.classList.toggle("active");
            toggle.classList.toggle("active", isActive);

            // Input açıkken ikonu gizle, kapalıyken göster
            if (isActive) {
                toggle.style.display = "none";
                // Input açılır açılmaz focus yap
                setTimeout(() => {
                    input.focus();
                }, 50);
            } else {
                toggle.style.display = "flex";
            }

            const group = toggle.closest(".product-option-group");
            if (!group) return;

            const choices = group.querySelectorAll(".option-choices .option-choice");

            if (isActive) {
                // Focus zaten yukarıda yapıldı
            } else {
                // Aramayı kapatırken filtreyi temizle
                input.value = "";
                choices.forEach((choice) => {
                    choice.style.display = "";
                });
            }
        };
        container.addEventListener("click", this.handleOptionSearchClick);

        // 3) Arama input'u ile filtreleme
        this.handleOptionSearchInput = (e) => {
            if (!e.target.classList.contains("option-search-input")) return;

            const query = e.target.value.trim().toLowerCase();
            const group = e.target.closest(".product-option-group");
            if (!group) return;

            const choices = group.querySelectorAll(".option-choices .option-choice");
            choices.forEach((choice) => {
                const nameEl = choice.querySelector(".choice-name");
                const text = (nameEl ? nameEl.textContent : "").toLowerCase();
                choice.style.display = text.includes(query) ? "" : "none";
            });
        };
        container.addEventListener("input", this.handleOptionSearchInput);

        // 4) Hover ile input açıldığında focus yap
        container.addEventListener(
            "mouseenter",
            (e) => {
                const wrapper = e.target.closest(".option-search-wrapper");
                if (!wrapper) return;

                const input = wrapper.querySelector(".option-search-input");
                if (!input || input.classList.contains("active")) return;

                // Hover ile input açıldığında focus yap
                setTimeout(() => {
                    if (!input.classList.contains("active")) {
                        input.classList.add("active");
                    }
                    input.focus();
                }, 100);
            },
            true,
        );
    }

    // Optional radio + min=0 ise "Seçim yok" seçeneğini sadece seçim yapıldıktan sonra göster
    syncNoneChoiceVisibility(changedInput) {
        if (!changedInput || changedInput.type !== "radio") return;

        // "Seçim yok" zaten ise bir şey yapma (grupta kalsın)
        const optionGroup = changedInput.closest(".product-option-group");
        if (!optionGroup) return;

        // "Seçim yok" seçildiyse: tüm radio seçimlerini kaldır, alt opsiyonları temizle ve kendisini kaldır
        if (changedInput.dataset && changedInput.dataset.none === "1") {
            // Aynı isimdeki tüm radio butonlarının seçimini kaldır
            const groupName = changedInput.name;
            if (groupName) {
                const radios = optionGroup.querySelectorAll(
                    `input[type="radio"][name="${groupName}"]`,
                );
                radios.forEach((r) => {
                    r.checked = false;
                    // Varsayılan qty'yi de sıfırla
                    r.setAttribute("data-qty", "0");
                });
            }

            // alt opsiyonları temizle (varsa)
            const subOptionsContainer = optionGroup.querySelector(
                ".sub-options-container",
            );
            if (subOptionsContainer) {
                subOptionsContainer.innerHTML = "";
                subOptionsContainer.style.display = "none";
            }

            // "Seçim yok" label'ını kaldır
            const noneLabel = changedInput.closest("label.option-choice");
            if (noneLabel) noneLabel.remove();

            // Fiyatı güncelle
            this.updatePrice();

            return;
        }

        const requiredEl = optionGroup.querySelector(".option-required");
        const isRequired = requiredEl && requiredEl.classList.contains("required");

        // Koşul: radio + isteğe bağlı (required:false) ise "Seçim yok" göster
        const isEligible = !isRequired;
        if (!isEligible) return;

        const optionChoices = optionGroup.querySelector(".option-choices");
        if (!optionChoices) return;

        const noneExists = !!optionChoices.querySelector(
            'input[type="radio"][data-none="1"]',
        );
        const anyChecked = !!optionChoices.querySelector(
            'input[type="radio"]:checked',
        );

        // Hiç seçim yoksa "Seçim yok" görünmesin (varsa kaldır)
        if (!anyChecked) {
            if (noneExists) {
                const noneInput = optionChoices.querySelector(
                    'input[type="radio"][data-none="1"]',
                );
                const noneLabel = noneInput
                    ? noneInput.closest("label.option-choice")
                    : null;
                if (noneLabel) noneLabel.remove();
            }
            return;
        }

        // Bir seçim yapıldıysa "Seçim yok" ekle (yoksa)
        if (!noneExists) {
            const optionId = optionGroup.getAttribute("data-option-id");
            const optionTitle =
                optionGroup.querySelector(".option-title")?.textContent?.trim() || "";

            // Aynı gruptaki gerçek radio'nun name'ini bul (instance id için)
            const firstRadio = optionChoices.querySelector('input[type="radio"]');
            const groupName =
                firstRadio?.name || (optionId ? `option_${optionId}` : "");

            // Option objesi benzeri minimal yapı (createOptionChoice için)
            const fauxOption = {
                id: optionId,
                type: "radio",
                title: optionTitle,
                required: false,
                min: 0,
                inputName: groupName,
            };

            const noneLabel = this.createOptionChoice(
                fauxOption,
                {
                    id: "__none__",
                    name: "Seçim yok",
                    price: 0,
                    maxQty: 1,
                    suboption: 0,
                    __none: true,
                },
                -1,
            );

            // En sona ekle (daha kullanıcı dostu)
            optionChoices.appendChild(noneLabel);
        }
    }

    // Handle sub-options toggle (show/hide sub-options when parent is selected)
    // Handle sub-options toggle (show/hide sub-options when parent is selected)
    async handleSubOptionsToggle(input) {
        if (isTahmisciBackendCatalogMode()) {
            this.updatePrice();
            return;
        }
        // Radio ve checkbox için çalışır
        if (input.type !== "radio" && input.type !== "checkbox") return;

        const container = document.getElementById("dynamicOptionsContainer");
        if (!container) return;

        // Sub option AJAX isteklerini takip etmek için instance-level state
        // Böylece geç dönen eski cevaplar DOM'a yanlış alt opsiyon basamaz.
        if (!this._productSubOptionRequests) {
            this._productSubOptionRequests = {};
        }

        // Aynı option grubundaki ortak sub-options host'u bul
        const optionGroup = input.closest(".product-option-group");
        if (!optionGroup) return;

        const subOptionsContainer = optionGroup.querySelector(
            ".sub-options-container",
        );
        if (!subOptionsContainer) return;

        const productId = this.currentProduct ? this.currentProduct.id : null;
        const optionId =
            input.getAttribute("data-option-id") ||
            optionGroup.getAttribute("data-option-id") ||
            "";

        const parentSelectionId =
            input.getAttribute("data-selection-id") ||
            input.value ||
            "";

        const requestKey = [
            productId || "no_product",
            optionId || "no_option",
            parentSelectionId || "no_selection",
        ].join("_");

        // Radio için: aynı grup içindeki tüm radio'ların alt opsiyonlarını temizle
        // Checkbox için: sadece bu checkbox'ın alt opsiyonlarını kontrol et
        if (input.type === "radio") {
            // Radio değiştiğinde her zaman container'ı temizle (önceki seçimin alt opsiyonlarını kaldırmak için)
            subOptionsContainer.innerHTML = "";
            subOptionsContainer.style.display = "none";
        } else if (input.type === "checkbox") {
            // Checkbox için: birden fazla checkbox seçili olabilir,
            // her birinin alt opsiyonları ayrı ayrı gösterilebilir.
            if (!input.checked) {
                // Bu seçime ait bekleyen AJAX cevabı varsa geçersiz kıl
                this._productSubOptionRequests[requestKey] =
                    "cancelled_" + Date.now();

                // Checkbox kaldırıldıysa, sadece bu checkbox'a ait alt opsiyon bloklarını temizle.
                const parentKey =
                    input.getAttribute("data-selection-id") || input.value || "";

                if (parentKey) {
                    const relatedGroups = subOptionsContainer.querySelectorAll(
                        `.product-option-group.sub-option-group[data-parent-selection="${parentKey}"]`,
                    );
                    relatedGroups.forEach((el) => el.remove());
                }

                // Eğer hiç alt opsiyon kalmadıysa container'ı gizle
                if (
                    !subOptionsContainer.querySelector(
                        ".product-option-group.sub-option-group",
                    )
                ) {
                    subOptionsContainer.style.display = "none";
                }

                this.updatePrice();
                return;
            }
        }

        // "Seçim yok" (optional radio) seçildiyse alt opsiyonları kapat ve çık
        if (input.dataset && input.dataset.none === "1") {
            // Bu seçime ait bekleyen AJAX cevabı varsa geçersiz kıl
            this._productSubOptionRequests[requestKey] =
                "cancelled_" + Date.now();

            this.updatePrice();
            return;
        }

        // Seçim kaldırıldıysa direkt fiyatı güncelle
        if (!input.checked) {
            // Bu seçime ait bekleyen AJAX cevabı varsa geçersiz kıl
            this._productSubOptionRequests[requestKey] =
                "cancelled_" + Date.now();

            this.updatePrice();
            return;
        }

        let subOptions = input._subOptions;

        // data-sub="1" ise bu seçenek için alt opsiyon AJAX ile yüklenecek
        const hasSubOptionFlag = input.dataset.sub === "1";

        if (
            (!subOptions || !Array.isArray(subOptions) || subOptions.length === 0) &&
            hasSubOptionFlag
        ) {
            try {
                const selectionId = input.getAttribute("data-selection-id") || null;

                // selectionId yoksa (ör: seçim yok) alt opsiyon arama
                if (!selectionId) {
                    this.updatePrice();
                    return;
                }

                const requestToken =
                    Date.now() + "_" + Math.random().toString(36).substring(2);

                this._productSubOptionRequests[requestKey] = requestToken;

                const resp = await fetch(getSiteRoot() + "/yeppanel/db/ajax/web/product-suboptions.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        productId,
                        optionId,
                        selectionId,
                        lang: getAjaxLang(),
                    }),
                });

                const data = await resp.json();

                // Geç dönen eski cevap ise DOM'a basma
                if (this._productSubOptionRequests[requestKey] !== requestToken) {
                    return;
                }

                // Modal kapandıysa, ürün değiştiyse veya input artık DOM'da değilse işlem yapma
                if (
                    !this.currentProduct ||
                    String(this.currentProduct.id) !== String(productId) ||
                    !input.isConnected
                ) {
                    return;
                }

                // Parent seçim artık seçili değilse eski cevabı yok say
                if (!input.checked) {
                    return;
                }

                if (
                    data &&
                    data.success &&
                    data.data &&
                    Array.isArray(data.data.options)
                ) {
                    subOptions = data.data.options;
                    input._subOptions = subOptions;
                }
            } catch (e) {
                console.error("Sub options load error:", e);
            }
        }

        // Seçilen input'a bağlı alt opsiyonlar yoksa sadece fiyatı güncelle
        if (!subOptions || !Array.isArray(subOptions) || subOptions.length === 0) {
            this.updatePrice();
            return;
        }

        // Render öncesi tekrar kontrol: input hala DOM'da ve seçili olmalı
        if (!input.isConnected || !input.checked) {
            this.updatePrice();
            return;
        }

        // Parantez içindeki isim: seçili öğenin kendi adı olmalı (örn: "Acı Sos"),
        // opsiyon grubu başlığı değil (örn: "Ek Malzemeler").
        const parentSelectionName =
            (input.value && input.value.trim()) ||
            (input.getAttribute("data-selection-name") || "").trim() ||
            (input.getAttribute("data-option-title") || "").trim() ||
            "";

        // Yeni alt opsiyonları render et (ana opsiyonlarla aynı yapı)
        subOptions.forEach((subOption) => {
            // Aynı sub-option farklı ana opsiyonlarda kullanılıyorsa,
            // radio gruplarının çakışmaması için instance bazlı bir id kullan.
            const originalId = subOption.id;
            const parentKey =
                input.getAttribute("data-selection-id") || input.value || "";
            const instanceId = parentKey
                ? `${originalId}_${parentKey}`
                : `${originalId}`;

            const subOptionGroup = document.createElement("div");
            subOptionGroup.className = "product-option-group sub-option-group";
            // Validasyon ve backend için orijinal option id'yi sakla
            subOptionGroup.setAttribute("data-option-id", originalId);
            // Hangi ana seçime (checkbox/radio) bağlı olduğunu takip et
            if (parentKey) {
                subOptionGroup.setAttribute("data-parent-selection", parentKey);
            }
            // min/max değerlerini data attribute olarak sakla (validasyon için)
            if (subOption.min !== undefined)
                subOptionGroup.setAttribute("data-option-min", subOption.min);
            if (subOption.max !== undefined)
                subOptionGroup.setAttribute("data-option-max", subOption.max);

            // Header (başlık + arama)
            const header = document.createElement("div");
            header.className = "option-group-header";

            const title = document.createElement("h4");
            title.className = "option-title";
            // Başlığa hangi ana opsiyona bağlı olduğunu ekle: "Sucuk Yoğunluğu (Acı Sos)"
            if (parentSelectionName) {
                title.textContent = `${subOption.title || "Seçenekler"} (${parentSelectionName})`;
            } else {
                title.textContent = subOption.title || "Seçenekler";
            }
            header.appendChild(title);

            // Arama butonu + input (opsiyonel - sub-optionlarda arama gerekli değilse kaldırılabilir)
            const searchWrapper = document.createElement("div");
            searchWrapper.className = "option-search-wrapper";

            const searchInput = document.createElement("input");
            searchInput.type = "text";
            searchInput.className = "option-search-input";
            const optionSearchPlaceholder =
                window.I18N?.getTranslations?.()?.[
                    window.I18N?.getPreferredLanguage?.() || "tr"
                ]?.option_search_placeholder || "Ara...";
            searchInput.placeholder = optionSearchPlaceholder;

            const searchToggle = document.createElement("button");
            searchToggle.type = "button";
            searchToggle.className = "option-search-toggle";
            searchToggle.innerHTML = '<i class="fas fa-search"></i>';

            searchWrapper.appendChild(searchInput);
            searchWrapper.appendChild(searchToggle);
            header.appendChild(searchWrapper);

            subOptionGroup.appendChild(header);

            // Limit & required bilgisi satırı
            const metaRow = document.createElement("div");
            metaRow.className = "option-meta-row";

            // min/max değerlerini kullan (maxSelectable yerine max kullan)
            const maxSelectable =
                subOption.max !== undefined
                    ? subOption.max
                    : subOption.maxSelectable ||
                    (subOption.type === "radio" ? 1 : subOption.items.length);

            const limitSpan = document.createElement("span");
            limitSpan.className = "option-limit";
            const limitPrefix =
                window.I18N?.getTranslations?.()?.[
                    window.I18N?.getPreferredLanguage?.() || "tr"
                ]?.option_limit_prefix || "En fazla";
            const limitSuffix =
                window.I18N?.getTranslations?.()?.[
                    window.I18N?.getPreferredLanguage?.() || "tr"
                ]?.option_limit_suffix || "adet seçebilirsiniz!";
            limitSpan.textContent = `${limitPrefix} ${maxSelectable} ${limitSuffix}`;

            const requiredSpan = document.createElement("span");
            requiredSpan.className = `option-required ${subOption.required ? "required" : "optional"}`;
            const requiredText =
                window.I18N?.getTranslations?.()?.[
                    window.I18N?.getPreferredLanguage?.() || "tr"
                ]?.option_required || "Zorunlu";
            const optionalText =
                window.I18N?.getTranslations?.()?.[
                    window.I18N?.getPreferredLanguage?.() || "tr"
                ]?.option_optional || "İsteğe Bağlı";
            requiredSpan.textContent = subOption.required
                ? requiredText
                : optionalText;

            metaRow.appendChild(limitSpan);
            metaRow.appendChild(requiredSpan);

            subOptionGroup.appendChild(metaRow);

            const subChoicesContainer = document.createElement("div");
            subChoicesContainer.className = "option-choices";

            subOption.items.forEach((subItem, subIndex) => {
                // createOptionChoice için: instance id'yi kullan ama orijinal id'yi de sakla
                const renderOption = {
                    ...subOption,
                    id: instanceId,
                    originalId: originalId,
                };

                const subChoiceLabel = this.createOptionChoice(
                    renderOption,
                    subItem,
                    subIndex,
                );
                subChoicesContainer.appendChild(subChoiceLabel);
            });

            subOptionGroup.appendChild(subChoicesContainer);

            // Alt opsiyonların gösterileceği ortak container (nested sub-options için)
            const nestedSubOptionsHost = document.createElement("div");
            nestedSubOptionsHost.className = "sub-options-container";
            nestedSubOptionsHost.style.display = "none";
            subOptionGroup.appendChild(nestedSubOptionsHost);

            subOptionsContainer.appendChild(subOptionGroup);
        });

        subOptionsContainer.style.display = "block";

        this.updatePrice();
    }
    async openProductModal(productId, cartItemId = null) {
        if (!productId) {
            return;
        }

        const product = this.products.find((p) => p.id === productId);
        if (!product) {
            return;
        }

        this.currentProduct = product;
        this.currentProduct.nutrition = Array.isArray(product.nutrition) ? product.nutrition : [];
        this.editingCartItemId = cartItemId;

        const nutritionTooltipContent = document.getElementById(
            "nutritionTooltipContent",
        );
        if (nutritionTooltipContent) {
            nutritionTooltipContent.innerHTML = "";
        }
        this.closeNutritionTooltip();

        // Find cart item if editing
        let cartItem = null;
        if (cartItemId) {
            const cartItems = window.globalCart
                ? window.globalCart.getItems()
                : this.cart;
            cartItem = cartItems.find((item) => item.id === cartItemId);
            if (cartItem) {
                this.currentQuantity = cartItem.quantity || 1;
                this.basePrice = cartItem.basePrice || product.basePrice;
            } else {
                this.currentQuantity = 1;
                this.basePrice = product.basePrice;
            }
        } else {
            this.currentQuantity = 1;
            this.basePrice = product.basePrice;
        }

        // Show spinner immediately before updating content
        const modalImageSpinner = document.getElementById(
            "modalImageLoadingSpinner",
        );
        if (modalImageSpinner) {
            modalImageSpinner.style.display = "flex";
        }

        // Show modal first (so spinner is visible)
        this.productModalOverlay.classList.add("active");
        document.body.style.overflow = "hidden";

        // Reset scroll position to top
        const modalInfo = document.querySelector(".product-modal-info");
        if (modalInfo) {
            modalInfo.scrollTop = 0;
        }

        // Update modal content with basic info first
        this.updateModalContent(product, null, null);
        this.updateModalOrderTypeVisibility();

        // Tükendi ise sepete ekle satırını gizle
        const addToCartRow = document.querySelector(".add-to-cart-row");
        if (addToCartRow) {
            addToCartRow.style.display = product.product_qr_status === "2" ? "none" : "";
        }

        // Load options and nutrition from API
        await this.loadProductOptions(productId);

        // Populate or reset form
        if (cartItem && cartItem.options) {
            await this.populateModalForm(cartItem);
        } else {
            this.resetModalForm();
        }

        // Update modal button text
        this.updateModalButtonText();

        // Calculate initial price
        this.updatePrice();

        // Initialize viewport detection for mobile browser chrome
        this.initializeViewportDetection();

        // Galeri sistemini başlat
        setTimeout(() => {
            const product = this.currentProduct;

            if (product) {
                // Eğer media array varsa kullan, yoksa product.image'dan tek resimli galeri oluştur
                if (
                    product.media &&
                    Array.isArray(product.media) &&
                    product.media.length > 0
                ) {
                    if (window.initProductGallery) {
                        const mediaWithSource = product.media.map((m) => ({
                            ...m,
                            isLogoFallback: !!(product.image_source === "company_logo" && m.type === "image" && m.url === product.image),
                        }));
                        window.initProductGallery(mediaWithSource);
                    }
                } else if (product.image) {
                    // Fallback: Tek resimli galeri oluştur
                    if (window.initProductGallery) {
                        window.initProductGallery([{
                            type: "image",
                            url: product.image,
                            isLogoFallback: product.image_source === "company_logo",
                        }]);
                    }
                }
            }
        }, 100);
    }

    updateModalOrderTypeVisibility() {
        const orderType = localStorage.getItem("menuOrderType");
        const modalFooter = document.querySelector(".product-modal-footer");
        if (!modalFooter) return;
        if (orderType === "tableMenu") {
            modalFooter.style.display = "none";
        } else {
            modalFooter.style.display = "";
        }
    }

    updateModalContent(product, options = null, nutrition = null) {
        const modalImageSpinner = document.getElementById(
            "modalImageLoadingSpinner",
        );

        // Eğer media array varsa eski resim sistemini atla (galeri kullanılacak)
        if (
            product.media &&
            Array.isArray(product.media) &&
            product.media.length > 0
        ) {
            // Galeri sistemi kullanılacak, eski resim sistemini atla
            // Spinner galeri render edildiğinde gizlenecek
            // Gallery will be initialized by window.initProductGallery in openProductModal
            if (modalImageSpinner) {
                modalImageSpinner.style.display = "flex";
            }
        } else {
            // Update product image with lazy loading and spinner (eski sistem)
            const modalImage = document.getElementById("modalProductImage");
            const modalImageSpinner = document.getElementById(
                "modalImageLoadingSpinner",
            );

            if (modalImage) {
                modalImage.alt = product.name || "";
                modalImage.classList.toggle("logo-fallback-image", product.image_source === "company_logo");

                // Reset image state
                modalImage.src = "";
                modalImage.classList.remove("loaded");
                modalImage.classList.add("lazy-image");

                // Ensure spinner is visible (already shown in openProductModal, but double-check)
                if (modalImageSpinner) {
                    modalImageSpinner.style.display = "flex";
                }

                // Load image with lazy loading
                if (product.image) {
                    const tempImg = new Image();

                    tempImg.onload = () => {
                        modalImage.src = product.image;
                        modalImage.classList.add("loaded");
                        modalImage.classList.remove("lazy-image");

                        // Hide spinner after image loads
                        if (modalImageSpinner) {
                            modalImageSpinner.style.display = "none";
                        }
                    };

                    tempImg.onerror = () => {
                        // Hide spinner on error
                        if (modalImageSpinner) {
                            modalImageSpinner.style.display = "none";
                        }
                        // Set placeholder image
                        modalImage.src = "assets/images/brand/favicon.png";
                        modalImage.classList.remove("lazy-image");
                        modalImage.classList.add("logo-fallback-image");
                    };

                    // Start loading
                    tempImg.src = product.image;
                } else {
                    // No image, hide spinner
                    if (modalImageSpinner) {
                        modalImageSpinner.style.display = "none";
                    }
                    modalImage.classList.remove("lazy-image");
                }
            }
        }

        // Update badge (tükendi öncelikli)
        const modalBadge = document.getElementById("modalProductBadge");
        if (modalBadge) {
            if (product.product_qr_status === "2") {
                modalBadge.textContent = "Tükendi";
                modalBadge.style.display = "block";
            } else if (product.badge) {
                modalBadge.textContent = this.getBadgeText(product.badge);
                modalBadge.style.display = "block";
            } else {
                modalBadge.style.display = "none";
            }
        }

        // Update product details
        const modalName = document.getElementById("modalProductName");
        if (modalName) modalName.textContent = product.name;

        if (modalName) {
            let categoryEl = document.getElementById("modalProductCategory");
            if (!categoryEl) {
                categoryEl = document.createElement("p");
                categoryEl.id = "modalProductCategory";
                categoryEl.className = "tahmisci-modal-category";
                modalName.insertAdjacentElement("afterend", categoryEl);
            }
            const categoryText = String(product.categoryName || product.parentCategoryName || "").trim();
            categoryEl.textContent = categoryText;
            categoryEl.style.display = categoryText ? "" : "none";
        }

        const modalDescription = document.getElementById("modalProductDescription");
        if (modalDescription) {
            const descriptionText = String(product.description || "").trim();
            modalDescription.textContent = descriptionText;
            modalDescription.style.display = descriptionText ? "" : "none";
        }

        // Store nutrition in currentProduct for getProductNutrition
        if (nutrition !== null) {
            if (!this.currentProduct) this.currentProduct = product;
            this.currentProduct.nutrition = Array.isArray(nutrition) ? nutrition : [];
        }
        this.updateNutritionActions(this.currentProduct || product);
        this.renderTahmisciRecipeSummary(this.currentProduct || product);

        // Render dynamic options only when data is available
        if (options !== null) {
            this.renderDynamicOptions(options || []);
        }

        // Initialize option listeners after rendering
        this.initializeOptionListeners();
    }

    // Public bootstrap already carries every detail safe to show on the website.
    async loadProductOptions(productId) {
        const optionsSpinner = document.getElementById("optionsLoadingSpinner");
        if (optionsSpinner) optionsSpinner.classList.remove("loading");
        if (!this.currentProduct || this.currentProduct.id !== productId) return;
        this.updateModalContent(this.currentProduct, [], this.currentProduct.nutrition || []);
    }

    // (duplicate initializeOptionListeners removed - use the main implementation above)

    // Render dynamic options with nested sub-options support
    renderDynamicOptions(options) {
        const container = document.getElementById("dynamicOptionsContainer");
        if (!container) return;

        const optionsSpinner = document.getElementById("optionsLoadingSpinner");
        container.innerHTML = "";
        if (optionsSpinner) {
            container.appendChild(optionsSpinner);
        }

        if (!options || options.length === 0) {
            if (optionsSpinner) {
                optionsSpinner.classList.remove("loading");
            }
            return;
        }

        options.forEach((option) => {
            if (!option.items || option.items.length === 0) {
                return; // Skip empty options
            }

            const optionGroup = document.createElement("div");
            optionGroup.className = "product-option-group";
            optionGroup.setAttribute("data-option-id", option.id);
            // min/max değerlerini data attribute olarak sakla (validasyon için)
            if (option.min !== undefined)
                optionGroup.setAttribute("data-option-min", option.min);
            if (option.max !== undefined)
                optionGroup.setAttribute("data-option-max", option.max);

            // Grup başlığı + arama alanı
            const header = document.createElement("div");
            header.className = "option-group-header";

            const title = document.createElement("h4");
            title.className = "option-title";
            title.textContent = option.title || "Seçenekler";
            header.appendChild(title);

            // Arama butonu + input
            const searchWrapper = document.createElement("div");
            searchWrapper.className = "option-search-wrapper";

            const searchInput = document.createElement("input");
            searchInput.type = "text";
            searchInput.className = "option-search-input";
            const optionSearchPlaceholder =
                window.I18N?.getTranslations?.()?.[
                    window.I18N?.getPreferredLanguage?.() || "tr"
                ]?.option_search_placeholder || "Ara...";
            searchInput.placeholder = optionSearchPlaceholder;

            const searchToggle = document.createElement("button");
            searchToggle.type = "button";
            searchToggle.className = "option-search-toggle";
            searchToggle.innerHTML = '<i class="fas fa-search"></i>';

            searchWrapper.appendChild(searchInput);
            searchWrapper.appendChild(searchToggle);
            header.appendChild(searchWrapper);

            optionGroup.appendChild(header);

            // Limit & required bilgisi satırı
            const metaRow = document.createElement("div");
            metaRow.className = "option-meta-row";

            // max değerini kullan (yoksa maxSelectable, yoksa varsayılan)
            const maxSelectable =
                option.max !== undefined
                    ? option.max
                    : option.maxSelectable ||
                    (option.type === "radio" ? 1 : option.items.length);

            const limitSpan = document.createElement("span");
            limitSpan.className = "option-limit";
            const limitPrefix =
                window.I18N?.getTranslations?.()?.[
                    window.I18N?.getPreferredLanguage?.() || "tr"
                ]?.option_limit_prefix || "En fazla";
            const limitSuffix =
                window.I18N?.getTranslations?.()?.[
                    window.I18N?.getPreferredLanguage?.() || "tr"
                ]?.option_limit_suffix || "adet seçebilirsiniz!";
            limitSpan.textContent = `${limitPrefix} ${maxSelectable} ${limitSuffix}`;

            const requiredSpan = document.createElement("span");
            requiredSpan.className = `option-required ${option.required ? "required" : "optional"
                }`;
            const requiredText =
                window.I18N?.getTranslations?.()?.[
                    window.I18N?.getPreferredLanguage?.() || "tr"
                ]?.option_required || "Zorunlu";
            const optionalText =
                window.I18N?.getTranslations?.()?.[
                    window.I18N?.getPreferredLanguage?.() || "tr"
                ]?.option_optional || "İsteğe Bağlı";
            requiredSpan.textContent = option.required ? requiredText : optionalText;

            metaRow.appendChild(limitSpan);
            metaRow.appendChild(requiredSpan);

            optionGroup.appendChild(metaRow);

            const choicesContainer = document.createElement("div");
            choicesContainer.className = "option-choices";
            optionGroup.appendChild(choicesContainer);

            // Alt opsiyonların gösterileceği ortak container
            const subOptionsHost = document.createElement("div");
            subOptionsHost.className = "sub-options-container";
            subOptionsHost.style.display = "none";
            optionGroup.appendChild(subOptionsHost);

            // Render option items
            option.items.forEach((item, index) => {
                const choiceLabel = this.createOptionChoice(option, item, index);
                choicesContainer.appendChild(choiceLabel);

                // Eğer bu item'in önceden yüklenmiş statik alt opsiyonu varsa, referansı sakla
                const inputEl = choiceLabel.querySelector("input");
                if (
                    inputEl &&
                    item.subOptions &&
                    Array.isArray(item.subOptions) &&
                    item.subOptions.length > 0
                ) {
                    inputEl._subOptions = item.subOptions;
                }
            });

            container.appendChild(optionGroup);
        });

        if (optionsSpinner) {
            optionsSpinner.classList.remove("loading");
        }
    }

    // Create option choice element
    createOptionChoice(option, item, index) {
        const label = document.createElement("label");
        label.className = "option-choice";

        const inputType = option.type === "radio" ? "radio" : "checkbox";
        // inputName override (özellikle "Seçim yok" için, mevcut grup ismini kullanmak üzere)
        const inputName = option.inputName || `option_${option.id}`;
        const isNoneChoice = !!(item && item.__none === true);
        const checkedAttr = ""; // default seçim yapılmasın
        const priceValue =
            item.price !== undefined && item.price !== null ? item.price : 0;
        const hasPrice = priceValue !== 0;

        const itemIdAttr = isNoneChoice
            ? ""
            : item && item.id !== undefined && item.id !== null
                ? String(item.id)
                : "";
        // Backend ve cart yapısı için orijinal option id'yi kullan (instance id değil)
        const logicalOptionId =
            option && option.originalId !== undefined && option.originalId !== null
                ? option.originalId
                : option.id;
        const optionIdAttr = String(logicalOptionId);
        const optionTitleAttr = option && option.title ? String(option.title) : "";
        const maxQtyAttr =
            item && item.maxQty !== undefined && item.maxQty !== null
                ? String(item.maxQty)
                : "";
        const subFlagAttr = isNoneChoice
            ? "0"
            : item && item.suboption !== undefined && item.suboption !== null
                ? String(item.suboption)
                : "0";

        // Checkbox options: quantity selector UI (no tick)
        if (inputType === "checkbox") {
            label.classList.add("option-choice-qty");
            label.innerHTML = `
        <input 
          type="checkbox" 
          name="${inputName}" 
          value="${this.escapeHtml(item.name)}" 
          data-price="${priceValue}"
          data-option-id="${this.escapeHtml(optionIdAttr)}"
          data-option-title="${this.escapeHtml(optionTitleAttr)}"
          data-selection-id="${this.escapeHtml(itemIdAttr)}"
          data-max-qty="${this.escapeHtml(maxQtyAttr)}"
          data-sub="${this.escapeHtml(subFlagAttr)}"
          class="option-qty-checkbox"
        >
        <div class="choice-content">
          <div class="choice-qty-left">
            <div class="choice-qty-controls" style="display:none;">
              <button type="button" class="choice-qty-btn" data-action="decrease" aria-label="decrease">-</button>
              <span class="choice-qty-value">1</span>
              <button type="button" class="choice-qty-btn" data-action="increase" aria-label="increase">+</button>
            </div>
          </div>
          <div class="choice-left">
            <span class="choice-name">${this.escapeHtml(item.name)}</span>
            ${hasPrice
                    ? `<span class="choice-price">${priceValue > 0 ? "+" : ""}${parseFloat(priceValue || 0).toFixed(2)}</span>`
                    : ""
                }
          </div>
        </div>
      `;

            // Bind qty buttons
            const checkbox = label.querySelector("input.option-qty-checkbox");
            const qtyValueEl = label.querySelector(".choice-qty-value");
            const controlsEl = label.querySelector(".choice-qty-controls");
            const decBtn = label.querySelector(
                '.choice-qty-btn[data-action="decrease"]',
            );
            const incBtn = label.querySelector(
                '.choice-qty-btn[data-action="increase"]',
            );
            const contentEl = label.querySelector(".choice-content");

            const getMax = () => {
                const raw = checkbox?.getAttribute("data-max-qty");
                const n = parseInt(raw, 10);
                // maxQty > 0 ise o değeri kullan, 0 / null / boş / geçersiz ise limitsiz (Infinity) kabul et
                return Number.isFinite(n) && n > 0 ? n : Infinity;
            };

            const setQty = (nextQty) => {
                const max = getMax();
                const clamped = Math.max(0, Math.min(max, nextQty));
                if (qtyValueEl) qtyValueEl.textContent = String(clamped);
                if (checkbox) {
                    const prevChecked = checkbox.checked;
                    checkbox.checked = clamped > 0;
                    checkbox.setAttribute("data-qty", String(clamped));
                    // Sadece checked durumu değiştiyse change event'i tetikle
                    // (0 -> 1 veya 1 -> 0). Qty artarken tekrar tekrar AJAX gitmesin.
                    if (prevChecked !== checkbox.checked) {
                        const changeEvent = new Event("change", { bubbles: true });
                        checkbox.dispatchEvent(changeEvent);
                    }
                }
                if (controlsEl) {
                    if (clamped <= 0) {
                        controlsEl.style.display = "none";
                    } else {
                        controlsEl.style.display = "inline-flex";
                    }
                }
                // update price when qty changes
                this.updatePrice();
            };

            // default qty 0 (unchecked) -> kontroller gizli, sadece satıra tıklayınca açılacak
            setQty(0);

            if (incBtn) {
                incBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const current =
                        parseInt(checkbox?.getAttribute("data-qty") || "0", 10) || 0;
                    setQty(current + 1);
                });
            }
            if (decBtn) {
                decBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const current =
                        parseInt(checkbox?.getAttribute("data-qty") || "0", 10) || 0;
                    setQty(current - 1);
                });
            }

            // Ana içerik alana tıklayınca da miktarı arttır (plus gibi davransın)
            if (contentEl) {
                contentEl.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const current =
                        parseInt(checkbox?.getAttribute("data-qty") || "0", 10) || 0;
                    setQty(current + 1);
                });
            }

            return label;
        }

        label.innerHTML = `
      <input 
        type="${inputType}" 
        name="${inputName}" 
        value="${this.escapeHtml(item.name)}" 
        data-price="${priceValue}"
        data-option-id="${this.escapeHtml(optionIdAttr)}"
        data-option-title="${this.escapeHtml(optionTitleAttr)}"
        data-selection-id="${this.escapeHtml(itemIdAttr)}"
        data-sub="${this.escapeHtml(subFlagAttr)}"
        ${isNoneChoice ? 'data-none="1"' : ""}
        ${checkedAttr}>
                <div class="choice-content">
        <span class="choice-name">${this.escapeHtml(item.name)}</span>
        ${hasPrice
                ? `<span class="choice-price">${priceValue > 0 ? "+" : ""
                }${parseFloat(priceValue || 0).toFixed(2)}</span>`
                : ""
            }
                </div>
            `;

        return label;
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#2B2A28;",
        };
        return text ? text.replace(/[&<>"']/g, (m) => map[m]) : "";
    }

    resetModalForm() {
        // Reset quantity
        this.currentQuantity = 1;
        if (this.modalQuantity) this.modalQuantity.textContent = "1";

        // Clear notes
        const productNotes = document.getElementById("productNotes");
        if (productNotes) productNotes.value = "";

        // Reset all option inputs - radio buttons: none checked, checkboxes: all unchecked
        const allOptionInputs = document.querySelectorAll(
            '#dynamicOptionsContainer input[type="radio"], #dynamicOptionsContainer input[type="checkbox"]',
        );
        allOptionInputs.forEach((input) => {
            // Tüm radio ve checkbox butonlarını seçili olmayan hale getir
            input.checked = false;
        });

        // Hide all sub-options containers
        const subOptionsContainers = document.querySelectorAll(
            ".sub-options-container",
        );
        subOptionsContainers.forEach((container) => {
            container.style.display = "none";
        });
    }

    async populateModalForm(cartItem) {
        // Set quantity
        this.currentQuantity = cartItem.quantity || 1;
        if (this.modalQuantity)
            this.modalQuantity.textContent = String(this.currentQuantity);

        // Set notes - clear if no notes exist
        const productNotes = document.getElementById("productNotes");
        if (productNotes) {
            if (
                cartItem.options &&
                cartItem.options.notes &&
                cartItem.options.notes.trim()
            ) {
                productNotes.value = cartItem.options.notes.trim();
            } else {
                productNotes.value = "";
            }
        }

        // Populate options from cartItem.options.selections hiyerarşik olarak
        if (!cartItem.options || !cartItem.options.selections) {
            this.updatePrice();
            return;
        }

        const container = document.getElementById("dynamicOptionsContainer");
        if (!container) {
            this.updatePrice();
            return;
        }

        // Seçimleri düz listeye çevir ve depth'e göre sırala (önce ana opsiyonlar, sonra sub'lar)
        const selectionRecords = [];

        Object.keys(cartItem.options.selections).forEach((optionKey) => {
            const list = Array.isArray(cartItem.options.selections[optionKey])
                ? cartItem.options.selections[optionKey]
                : [];

            list.forEach((sel) => {
                if (!sel) return;
                const id = sel.id ?? sel.selectionId ?? null;
                const rec = {
                    raw: sel,
                    optionKey,
                    optionId: sel.optionId || optionKey,
                    id,
                    name: sel.name || "",
                    qty: parseInt(sel.qty ?? sel.quantity ?? "1", 10) || 1,
                    isSubOption: !!sel.isSubOption,
                    parentSelectionId: sel.parentSelectionId ?? null,
                    depth: sel.depth ?? 0,
                };
                selectionRecords.push(rec);
            });
        });

        // Derinliğe göre sırala (önce ana opsiyonlar)
        selectionRecords.sort((a, b) => (a.depth || 0) - (b.depth || 0));

        const findInputForSelection = (rec) => {
            const idStr = rec.id !== null ? String(rec.id) : null;

            if (!rec.isSubOption) {
                // Ana opsiyon: doğrudan option_{id} grubunda ara
                if (idStr) {
                    return container.querySelector(
                        `input[name="option_${rec.optionId}"][data-selection-id="${idStr}"]`,
                    );
                }
                if (rec.name) {
                    return container.querySelector(
                        `input[name="option_${rec.optionId}"][value="${rec.name}"]`,
                    );
                }
                return null;
            }

            // Sub-option: selection id + parentSelectionId'ye göre bul
            const candidates = Array.from(
                container.querySelectorAll(
                    idStr
                        ? `input[data-selection-id="${idStr}"]`
                        : `input[value="${rec.name}"]`,
                ),
            );
            if (candidates.length === 0) return null;

            if (rec.parentSelectionId != null) {
                const parentKey = String(rec.parentSelectionId);
                const withParent = candidates.find((input) => {
                    const group = input.closest(".product-option-group.sub-option-group");
                    if (!group) return false;
                    const grpParent = group.getAttribute("data-parent-selection");
                    return grpParent && String(grpParent) === parentKey;
                });
                if (withParent) return withParent;
            }

            // Fallback: ilk adayı kullan
            return candidates[0];
        };

        // Seçimleri sırayla uygula, sub-option'lar için de gerekirse alt seviye aç
        for (const rec of selectionRecords) {
            const input = findInputForSelection(rec);
            if (!input) continue;

            const qty = rec.qty || 1;

            if (input.type === "radio") {
                input.checked = true;
                input.setAttribute("data-qty", String(qty));
                // Radio için alt opsiyonları ve "Seçim yok" butonunu hazırla
                await this.handleSubOptionsToggle(input);
                this.syncNoneChoiceVisibility(input);
            } else if (input.type === "checkbox") {
                input.checked = qty > 0;
                input.setAttribute("data-qty", String(qty));

                const parentChoice = input.closest(".option-choice-qty");
                const qtyEl = parentChoice
                    ? parentChoice.querySelector(".choice-qty-value")
                    : null;
                const addBtn = parentChoice
                    ? parentChoice.querySelector(".choice-qty-add")
                    : null;
                const controlsEl = parentChoice
                    ? parentChoice.querySelector(".choice-qty-controls")
                    : null;

                if (qtyEl) qtyEl.textContent = String(qty);
                if (controlsEl) {
                    if (addBtn) {
                        if (qty > 0) {
                            controlsEl.style.display = "inline-flex";
                            addBtn.style.display = "none";
                        } else {
                            controlsEl.style.display = "none";
                            addBtn.style.display = "inline-flex";
                        }
                    } else {
                        controlsEl.style.display = qty > 0 ? "inline-flex" : "none";
                    }
                }

                // Checkbox için de alt opsiyonları kontrol et (varsa)
                await this.handleSubOptionsToggle(input);
            }
        }

        this.updatePrice();
    }

    updateModalButtonText() {
        const modalAddToCartBtn = this.modalAddToCart;
        if (!modalAddToCartBtn) return;

        // Get translations
        const translations = window.I18N?.getTranslations?.();
        const lang = window.I18N?.getPreferredLanguage?.() || "tr";
        const t = (key, fallback) =>
            translations?.[lang]?.[key] !== undefined
                ? translations[lang][key]
                : fallback;

        if (this.editingCartItemId) {
            modalAddToCartBtn.textContent = t("cart_update_btn", "Güncelle");
            modalAddToCartBtn.setAttribute("data-i18n", "cart_update_btn");
        } else {
            modalAddToCartBtn.textContent = t("product_action_add", "Ekle");
            modalAddToCartBtn.setAttribute("data-i18n", "product_action_add");
        }
    }

    changeQuantity(change) {
        const newQuantity = this.currentQuantity + change;

        if (newQuantity >= 1) {
            this.currentQuantity = newQuantity;
            if (this.modalQuantity) {
                this.modalQuantity.textContent = this.currentQuantity;
            }
            this.updatePrice();
        }
    }

    updatePrice() {
        if (!this.currentProduct) return;

        let totalPrice = parseFloat(this.currentProduct.basePrice) || 0;

        // Get all checked option inputs (radio and checkbox)
        const allCheckedInputs = document.querySelectorAll(
            "#dynamicOptionsContainer input:checked",
        );

        allCheckedInputs.forEach((input) => {
            // "Seçim yok" radioları fiyat hesabına dahil etme
            if (input.dataset && input.dataset.none === "1") return;
            const price = parseFloat(input.dataset.price) || 0;
            const qty = parseInt(input.getAttribute("data-qty") || "1", 10) || 1;
            totalPrice += price * qty;
        });

        // Multiply by quantity
        const finalPrice = totalPrice * this.currentQuantity;

        // Update price display
        if (this.modalTotalPrice) {
            this.modalTotalPrice.textContent = finalPrice.toFixed(2) + "";
        }

        // Update current price display
        const modalCurrentPrice = document.getElementById("modalCurrentPrice");
        if (modalCurrentPrice) {
            const priceText = window.TahmisciCatalog
                ? this.formatTahmisciPriceLabel(this.currentProduct)
                : (this.currentProduct?.priceLabel || ("₺" + totalPrice.toFixed(2)));
            modalCurrentPrice.textContent = priceText;
            const priceWrap = modalCurrentPrice.closest(".product-modal-price");
            if (priceWrap) priceWrap.style.display = priceText ? "flex" : "none";
        }

        // Update old price if exists
        const modalOldPrice = document.getElementById("modalOldPrice");
        const modalOldPriceTop = document.getElementById("modalOldPriceTop");

        if (this.currentProduct && this.currentProduct.oldPrice) {
            if (modalOldPrice) {
                modalOldPrice.textContent =
                    (this.currentProduct.oldPrice * this.currentQuantity).toFixed(2) + "";
                modalOldPrice.style.display = "inline";
            }
            if (modalOldPriceTop) {
                modalOldPriceTop.textContent =
                    Number(this.currentProduct.oldPrice).toFixed(2) + "";
                modalOldPriceTop.style.display = "inline";
            }
        } else {
            if (modalOldPrice) {
                modalOldPrice.style.display = "none";
            }
            if (modalOldPriceTop) {
                modalOldPriceTop.style.display = "none";
            }
        }
    }

    // Validate options before adding to cart
    validateOptions() {
        const container = document.getElementById("dynamicOptionsContainer");
        if (!container) return { valid: true, error: null };

        // Sadece ana option group'ları bul (sub-option-group olmayan)
        const mainOptionGroups = container.querySelectorAll(
            ".product-option-group:not(.sub-option-group)",
        );

        // Ana opsiyonları kontrol et
        for (const group of mainOptionGroups) {
            const validationResult = this.validateOptionGroup(group);
            if (!validationResult.valid) {
                return validationResult;
            }
        }

        // Görünür sub-option group'ları kontrol et
        const visibleSubOptionGroups =
            container.querySelectorAll(".sub-option-group");
        for (const subGroup of visibleSubOptionGroups) {
            // Sub-option container'ının display:none olup olmadığını kontrol et
            const subContainer = subGroup.closest(".sub-options-container");
            if (subContainer && subContainer.style.display === "none") {
                continue; // Görünür değilse kontrol etme
            }

            const validationResult = this.validateOptionGroup(subGroup);
            if (!validationResult.valid) {
                return validationResult;
            }
        }

        return { valid: true, error: null };
    }

    // Tek bir option group'u kontrol et
    validateOptionGroup(group) {
        const optionId = group.getAttribute("data-option-id");
        if (!optionId) return { valid: true, error: null };

        // Option metadata'sını bul (required, min, max, title)
        const titleEl = group.querySelector(".option-title");
        const optionTitle = titleEl ? titleEl.textContent.trim() : "Opsiyon";

        const requiredEl = group.querySelector(".option-required");
        const isRequired = requiredEl && requiredEl.classList.contains("required");

        // min/max değerlerini data attribute'dan al
        const minValue =
            parseInt(group.getAttribute("data-option-min") || "0", 10) || 0;
        const maxValueAttr = group.getAttribute("data-option-max");
        const maxValue =
            maxValueAttr !== null ? parseInt(maxValueAttr, 10) || Infinity : Infinity;

        // Bu option için seçilen input'ları bul (sadece bu group'un direkt option-choices'ından)
        const optionChoices = group.querySelector(".option-choices");
        if (!optionChoices) return { valid: true, error: null };

        const checkedInputs = optionChoices.querySelectorAll(
            'input:checked:not([data-none="1"])',
        );

        // min/max kontrolü için: seçilen opsiyon SAYISI (radio veya checkbox'ların kendisi, qty değil)
        const selectedCount = checkedInputs.length;

        // Çok dilli mesajlar için
        const lang = window.I18N?.getPreferredLanguage?.() || "tr";
        const translations = window.I18N?.getTranslations?.()?.[lang] || {};

        // Required kontrolü: required ise en az 1 seçim olmalı
        if (isRequired && selectedCount === 0) {
            const template =
                translations.validation_required ||
                "{title} zorunludur. Lütfen seçim yapınız.";
            return {
                valid: false,
                error: template.replace("{title}", optionTitle),
            };
        }

        // min kontrolü: min değerinden az seçim yapılmışsa (ve seçim yapılmışsa)
        if (selectedCount > 0 && selectedCount < minValue) {
            const template =
                translations.validation_min_selection ||
                "{title} için en az {min} adet seçim yapmalısınız.";
            return {
                valid: false,
                error: template
                    .replace("{title}", optionTitle)
                    .replace("{min}", minValue),
            };
        }

        // max kontrolü: max değerinden fazla seçim yapılmışsa
        if (Number.isFinite(maxValue) && selectedCount > maxValue) {
            const template =
                translations.validation_max_selection ||
                "{title} için en fazla {max} adet seçebilirsiniz.";
            return {
                valid: false,
                error: template
                    .replace("{title}", optionTitle)
                    .replace("{max}", maxValue),
            };
        }

        return { valid: true, error: null };
    }

    addToCartFromModal() {
        if (!this.currentProduct) {
            return;
        }
        if (this.currentProduct.product_qr_status === "2") {
            return;
        }

        // Validasyon kontrolü
        const validation = this.validateOptions();
        if (!validation.valid) {
            if (window.Swal && typeof window.Swal.fire === "function") {
                const lang = window.I18N?.getPreferredLanguage?.() || "tr";
                const translations = window.I18N?.getTranslations?.()?.[lang] || {};
                const warningTitle = translations.warning_title || "Uyarı";
                const confirmText = translations.confirm_button || "Tamam";

                window.Swal.fire({
                    title: warningTitle,
                    text: validation.error,
                    icon: "warning",
                    confirmButtonText: confirmText,
                    confirmButtonColor: "#8C734B",
                });
            }
            return;
        }

        // Fly-to-cart animation (only for new items, not when editing)
        if (!this.editingCartItemId) {
            this.flyToCart();
        }

        // Get all selected options (dynamic)
        const allCheckedInputs = document.querySelectorAll(
            "#dynamicOptionsContainer input:checked",
        );
        const notes = document.getElementById("productNotes");

        // Calculate total price
        let totalPrice = this.currentProduct.basePrice || 0;

        // Build options object from all checked inputs
        const options = {
            notes: notes ? notes.value : "",
            selections: {},
        };
        const normalizeSelectionRef = (value) => {
            if (value === null || value === undefined) return null;
            const raw = String(value).trim();
            if (!raw || raw === "0") return null;
            if (/^-?\d+$/.test(raw)) {
                const n = parseInt(raw, 10);
                return n > 0 ? String(n) : null;
            }
            return raw;
        };

        let invalidOptionSelection = false;
        let invalidOptionMessage = "";

        // Group selections by option id and store selection ids too
        allCheckedInputs.forEach((input) => {
            // "Seçim yok" radiolarını options içine alma
            if (input.dataset && input.dataset.none === "1") {
                return;
            }
            const optionId =
                input.getAttribute("data-option-id") ||
                input.name.replace("option_", "");
            const selectionId = normalizeSelectionRef(
                input.getAttribute("data-selection-id") || null,
            );
            const optionValue = input.value;

            // Gerçek option detail ID yoksa bu seçim güvenli değil.
            // Bu alan backend'de units_type çözümü için zorunlu.
            if (!selectionId) {
                invalidOptionSelection = true;
                invalidOptionMessage = "Seçilen ürün opsiyonlarından biri eksik veya hatalı görünüyor. Lütfen ürünü tekrar seçiniz.";
                return;
            }
            const optionPrice = parseFloat(input.dataset.price) || 0;
            const optQty = parseInt(input.getAttribute("data-qty") || "1", 10) || 1;
            const optionTitle = input.getAttribute("data-option-title") || "";

            // Hiyerarşi bilgisi: bu seçim bir sub-option mı?
            let isSubOption = false;
            let parentSelectionId = null;
            let parentOptionId = null;
            let depth = 0;

            const nearestSubGroup = input.closest(
                ".product-option-group.sub-option-group",
            );
            if (nearestSubGroup) {
                isSubOption = true;
                parentSelectionId = normalizeSelectionRef(
                    nearestSubGroup.getAttribute("data-parent-selection") || null,
                );

                if (!parentSelectionId) {
                    invalidOptionSelection = true;
                    invalidOptionMessage = "Alt opsiyon bağlantısı doğrulanamadı. Lütfen ürünü tekrar seçiniz.";
                    return;
                }

                // Parent option id'yi bul (parent selection input'unun option-id'si)
                if (parentSelectionId) {
                    const parentInput = document.querySelector(
                        `#dynamicOptionsContainer input[data-selection-id="${parentSelectionId}"]`,
                    );
                    if (parentInput) {
                        parentOptionId = normalizeSelectionRef(
                            parentInput.getAttribute("data-option-id") || null,
                        );
                    }
                }

                // Derinlik (sub-option of sub-option vs.) hesapla
                let currentGroup = nearestSubGroup;
                while (
                    currentGroup &&
                    currentGroup.classList.contains("sub-option-group")
                ) {
                    depth += 1;
                    const parentSubGroup =
                        currentGroup
                            .closest(".sub-options-container")
                            ?.closest(".product-option-group.sub-option-group") || null;
                    currentGroup = parentSubGroup;
                }
            }

            totalPrice += optionPrice * optQty;

            if (!options.selections[optionId]) {
                options.selections[optionId] = [];
            }

            options.selections[optionId].push({
                id: selectionId,
                optionId: optionId,
                name: optionValue,
                price: optionPrice,
                qty: optQty,
                optionTitle: optionTitle,
                // Hiyerarşi bilgisi: ana opsiyon / sub opsiyon zinciri
                isSubOption,
                parentOptionId,
                parentSelectionId,
                depth,
            });
        });

        if (invalidOptionSelection) {
            if (window.Swal && typeof window.Swal.fire === "function") {
                const lang = window.I18N?.getPreferredLanguage?.() || "tr";
                const translations = window.I18N?.getTranslations?.()?.[lang] || {};
                const warningTitle = translations.warning_title || "Uyarı";
                const confirmText = translations.confirm_button || "Tamam";

                window.Swal.fire({
                    title: warningTitle,
                    text: invalidOptionMessage || "Ürün opsiyonları doğrulanamadı. Lütfen tekrar deneyiniz.",
                    icon: "warning",
                    confirmButtonText: confirmText,
                    confirmButtonColor: "#8C734B",
                });
            }

            return;
        }

        // Calculate unit price (NOT total price - will be multiplied by quantity in cart display)
        const unitPrice = totalPrice; // price per unit (basePrice + options with qty)

        // Save product info before adding to cart (for notification)
        const productName = this.currentProduct.name || "Ürün";
        const quantity = this.currentQuantity || 1;

        // If editing, preserve addedAt timestamp from old item
        let preserveAddedAt = null;
        if (this.editingCartItemId) {
            const cartItems = window.globalCart
                ? window.globalCart.getItems()
                : this.cart;
            const oldItem = cartItems.find(
                (item) => item.id === this.editingCartItemId,
            );
            if (oldItem && oldItem.addedAt) {
                preserveAddedAt = oldItem.addedAt;
            }
            this.removeFromCart(this.editingCartItemId);
        }

        // Add to cart (or update by removing and re-adding)
        // Preserve addedAt if editing
        if (preserveAddedAt) {
            options._preserveAddedAt = preserveAddedAt;
        }

        this.addToCart(
            this.currentProduct,
            this.currentQuantity,
            options,
            unitPrice, // Unit price, not total price
        );

        // Close modal
        this.closeProductModal();

        // Update cart counter and modal
        this.updateCartCounter();
        this.renderNewCartModal();
    }

    flyToCart() {
        if (!this.currentProduct) return;

        let startRect = null;
        let imageSrc = null;
        let initialWidth = 80;
        let initialHeight = 80;

        // Start from the "Ekle" (Add to Cart) button
        const addToCartBtn =
            this.modalAddToCart || document.getElementById("modalAddToCart");

        if (addToCartBtn) {
            startRect = addToCartBtn.getBoundingClientRect();
            // Get product image for the flying element
            const productGalleryMain = document.getElementById("productGalleryMain");
            if (productGalleryMain) {
                const productImage =
                    productGalleryMain.querySelector("img.loaded:not(.hidden)") ||
                    productGalleryMain.querySelector("img.loaded") ||
                    productGalleryMain.querySelector("img:not(.hidden)") ||
                    productGalleryMain.querySelector("img");

                if (productImage) {
                    imageSrc =
                        productImage.src ||
                        productImage.getAttribute("data-src") ||
                        productImage.getAttribute("src");
                }
            }

            // Fallback: use product image from data
            if (!imageSrc && this.currentProduct && this.currentProduct.image) {
                imageSrc = this.currentProduct.image;
            }
        }

        // If button not found, use modal center as fallback
        if (!startRect) {
            const modal = document.getElementById("productModalOverlay");
            if (modal) {
                const modalRect = modal.getBoundingClientRect();
                startRect = {
                    left: modalRect.left + modalRect.width / 2 - initialWidth / 2,
                    top: modalRect.top + modalRect.height / 2 - initialHeight / 2,
                };
            }

            // Get product image
            if (this.currentProduct && this.currentProduct.image) {
                imageSrc = this.currentProduct.image;
            }
        }

        // Ensure minimum size
        if (initialWidth < 80) initialWidth = 80;
        if (initialHeight < 60) initialHeight = 60;

        if (!imageSrc || !startRect) return;

        // Determine target button (mobile or desktop)
        const isMobile = window.innerWidth < 992;
        const targetCartBtn = isMobile
            ? document.getElementById("mobileCartBtn")
            : document.getElementById("desktopCartBtn");

        if (!targetCartBtn) return;

        // Get cart button position
        const cartRect = targetCartBtn.getBoundingClientRect();

        // Create fly element
        const flyElement = document.createElement("div");
        flyElement.className = "fly-to-cart-img";

        // Set initial styles (start from button position)
        const startX = startRect.left + startRect.width / 2;
        const startY = startRect.top + startRect.height / 2;

        flyElement.style.cssText = `
      position: fixed;
      left: ${startX - initialWidth / 2}px;
      top: ${startY - initialHeight / 2}px;
      width: ${initialWidth}px;
      height: ${initialHeight}px;
      background-image: url("${imageSrc}");
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      border-radius: 8px;
      transform: scale(1);
      opacity: 1;
      z-index: 99999;
      pointer-events: none !important;
      transition: none;
      box-shadow: 0 4px 12px rgba(46, 36, 24, 0.15);
      will-change: transform, opacity;
    `;

        document.body.appendChild(flyElement);

        // Force reflow
        flyElement.offsetHeight;

        // Calculate target position (center of cart button)
        // Target the exact center for both mobile and desktop
        const targetX = cartRect.left + cartRect.width / 2;
        const targetY = cartRect.top + cartRect.height / 2;

        // Animate to target
        requestAnimationFrame(() => {
            flyElement.style.transition =
                "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease-out";
            flyElement.style.transform = `translate3d(${targetX - startX}px, ${targetY - startY}px, 0) scale(0.2)`;
            flyElement.style.opacity = "0";
        });

        // Remove element after animation
        const removeElement = () => {
            if (flyElement.parentNode) {
                flyElement.parentNode.removeChild(flyElement);
            }
        };

        flyElement.addEventListener("transitionend", removeElement, { once: true });

        // Safety: Remove element after max duration (in case transitionend doesn't fire)
        setTimeout(removeElement, 1500); // 800ms animation + 700ms buffer
    }

    closeProductModal() {
        if (this.productModalOverlay) {
            this.productModalOverlay.classList.remove("active");
            // Swipe sonrası inline stilleri temizle (tekrar açılışta kayma kalmasın)
            this.productModalOverlay.style.opacity = "";
            const modalBox = this.productModalOverlay.querySelector(".product-modal");
            if (modalBox) modalBox.style.transform = "";
        }
        document.body.style.overflow = "";
        this.currentProduct = null;
        this.editingCartItemId = null;
        // Reset options container + spinner for next open
        const optionsContainer = document.getElementById("dynamicOptionsContainer");
        const optionsSpinner = document.getElementById("optionsLoadingSpinner");
        if (optionsContainer) {
            optionsContainer.innerHTML = "";
            if (optionsSpinner) {
                optionsSpinner.classList.add("loading");
                optionsContainer.appendChild(optionsSpinner);
            }
        } else if (optionsSpinner) {
            optionsSpinner.classList.add("loading");
        }

        // Cleanup viewport detection
        this.cleanupViewportDetection();
    }

    getBadgeText(badge) {
        const badges = {
            popular: "Popüler",
            new: "Yeni",
            discount: "%15 İndirim",
            healthy: "Sağlıklı",
            hot: "Sıcak",
            breakfast: "Kahvaltı",
        };
        return badges[badge] || "";
    }

    // ========== CART SYSTEM ==========

    addToCart(product, quantity, options, totalPrice) {
        if (!product) {
            return;
        }
        // Use global cart manager if available
        if (window.globalCart) {
            // CartSystem.generateCartItemId ile id üret
            const cartSystem =
                window.Cart || (window.CartSystem ? window.CartSystem : null);
            let id = null;
            if (cartSystem && typeof cartSystem.generateCartItemId === "function") {
                id = cartSystem.generateCartItemId(product.id, options);
            }
            // options objesine id ekle (gerekirse)
            if (id) options._cartId = id;
            window.globalCart.addToCart(product, quantity, options, totalPrice);
            try {
                var ot = localStorage.getItem("menuOrderType");
                if (ot) localStorage.setItem("lastCartOrderType", ot);
            } catch (e) { }
            // Force update cart count immediately
            if (
                window.globalCart &&
                typeof window.globalCart.updateCartCount === "function"
            ) {
                window.globalCart.updateCartCount();
            }
        } else {
            // Fallback to local cart
            // CartSystem.generateCartItemId ile id üret
            const cartSystem =
                window.Cart || (window.CartSystem ? window.CartSystem : null);
            let id = null;
            if (cartSystem && typeof cartSystem.generateCartItemId === "function") {
                id = cartSystem.generateCartItemId(product.id, options);
            }
            const cartItem = {
                id: id || product.id + "_" + Date.now(),
                productId: product.id,
                name: product.name,
                image: product.image,
                image_source: product.image_source || "product",
                quantity: quantity,
                price: totalPrice,
                options: options,
            };
            this.cart.push(cartItem);
            this.saveCart();
            this.updateCartCounter();
            this.renderNewCartModal();
        }
    }

    removeFromCart(cartItemId) {
        // Use global cart manager if available
        if (window.globalCart) {
            window.globalCart.removeFromCart(cartItemId);
            // Force update cart count immediately
            if (
                window.globalCart &&
                typeof window.globalCart.updateCartCount === "function"
            ) {
                window.globalCart.updateCartCount();
            }
            // Update modal if open
            const modalOverlay = document.getElementById("newCartModalOverlay");
            if (modalOverlay && modalOverlay.classList.contains("active")) {
                this.renderNewCartModal();
            }
            return;
        }

        // Fallback to local cart
        const initialLength = this.cart.length;
        this.cart = this.cart.filter((item) => item.id !== cartItemId);

        if (this.cart.length < initialLength) {
            this.saveCart();
            this.updateCartCounter();
            this.renderCartItems();
        }
    }

    updateCartQuantity(cartItemId, newQuantity) {
        // Use global cart manager if available
        if (window.globalCart) {
            window.globalCart.updateCartQuantity(cartItemId, newQuantity);
            // Force update cart count immediately
            if (
                window.globalCart &&
                typeof window.globalCart.updateCartCount === "function"
            ) {
                window.globalCart.updateCartCount();
            }
            // Update modal if open
            const modalOverlay = document.getElementById("newCartModalOverlay");
            if (modalOverlay && modalOverlay.classList.contains("active")) {
                this.renderNewCartModal();
            }
            return;
        }

        // Fallback to local cart
        const item = this.cart.find((item) => item.id === cartItemId);
        if (item) {
            if (newQuantity <= 0) {
                // Remove item if quantity is 0 or less
                this.removeFromCart(cartItemId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartCounter();
                this.renderCartItems();
            }
        }
    }

    getCartTotal() {
        return this.cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
        );
    }

    getCartItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartCounter() {
        // Use global cart manager if available
        if (window.globalCart) {
            // Global cart kullanıyorsa, direkt updateCartDisplay çağır (zaten mobile-cart-count'u güncelliyor)
            window.globalCart.updateCartDisplay();

            // Update desktop cart button badge
            const desktopCartBadge = document.getElementById("desktopCartBadge");
            if (desktopCartBadge) {
                const totalItems = window.globalCart.getTotalItems
                    ? window.globalCart.getTotalItems()
                    : window.globalCart.getItems
                        ? window.globalCart
                            .getItems()
                            .reduce((count, item) => count + (item.quantity || 1), 0)
                        : 0;
                desktopCartBadge.textContent = totalItems > 0 ? totalItems : "";
                desktopCartBadge.style.display = totalItems > 0 ? "flex" : "none";
            }
            return; // Global cart kullanıyorsa, local cart güncellemesine gerek yok
        }

        // Fallback to local cart counter update (only if globalCart is not available)
        const cartCountElements = document.querySelectorAll(
            ".cart-count, .mobile-cart-count, #fixedCartCount, #mobileCartCount",
        );
        const cartTotalElements = document.querySelectorAll(
            ".cart-total, .mobile-cart-total",
        );
        const itemCount = this.getCartItemCount();
        const totalAmount = this.getCartTotal();

        // Update count
        cartCountElements.forEach((element) => {
            element.textContent = itemCount;
            element.style.display = itemCount > 0 ? "flex" : "none";
        });

        // Update total amount
        cartTotalElements.forEach((element) => {
            if (totalAmount > 0) {
                element.textContent = this.formatPrice(totalAmount);
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
        });
    }

    formatPrice(amount) {
        return parseFloat(amount || 0).toFixed(2);
    }

    saveCart() {
        try {
            localStorage.setItem("yeppos_cart", JSON.stringify(this.cart));
        } catch (e) {
            // Cart save error
        }
    }

    loadCart() {
        try {
            const savedCart = localStorage.getItem("yeppos_cart");
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);

                // Clean up old cart data structure
                this.cart = parsedCart.filter((item) => {
                    if (!item.id || !item.name || !item.price) {
                        return false;
                    }

                    // Ensure options structure exists
                    if (!item.options) {
                        item.options = { size: null, extras: [], notes: "" };
                    }
                    if (!item.options.extras) {
                        item.options.extras = [];
                    }

                    return true;
                });
            } else {
                this.cart = [];
            }
        } catch (e) {
            this.cart = [];
        }
    }

    savePromo() {
        try {
            if (this.appliedPromos && this.appliedPromos.length > 0) {
                const json = JSON.stringify(this.appliedPromos);
                localStorage.setItem("yeppos_applied_promo", json);
            } else {
                localStorage.removeItem("yeppos_applied_promo");
            }
        } catch (e) {
            console.error("Promo save error:", e);
        }
    }

    loadPromo() {
        try {
            const savedPromo = localStorage.getItem("yeppos_applied_promo")
            if (savedPromo) {
                const parsed = JSON.parse(savedPromo);
                if (Array.isArray(parsed)) {
                    this.appliedPromos = parsed;
                } else if (parsed) {
                    // Eski tekli formatı da destekle
                    this.appliedPromos = [parsed];
                } else {
                    this.appliedPromos = [];
                }
            } else {
                this.appliedPromos = [];
            }
        } catch (e) {
            this.appliedPromos = [];
        }
    }

    updateDesktopCartButtonPosition() {
        const callWaiterBtn = document.getElementById("callWaiterBtn");
        const desktopCartBtn = document.querySelector(".desktop-cart-btn");

        if (!desktopCartBtn) return;

        // Always hide on mobile devices (width < 992px)
        const isMobile = window.innerWidth < 992;
        if (isMobile) {
            desktopCartBtn.style.display = "none";
            return;
        }

        // Check order type - hide button if tableMenu (Masa Menüsü) on desktop
        const orderType = localStorage.getItem("menuOrderType");
        if (orderType === "tableMenu") {
            desktopCartBtn.style.display = "none";
            return;
        }

        // Show button on desktop (non-mobile) when not tableMenu
        desktopCartBtn.style.display = "flex";

        // Check if callWaiterBtn is visible
        let isCallWaiterVisible = false;
        if (callWaiterBtn) {
            // First check inline style (most reliable for programmatic changes)
            const inlineDisplay = callWaiterBtn.style.display;
            if (inlineDisplay) {
                isCallWaiterVisible = inlineDisplay !== "none";
            } else {
                // Fallback to computed style
                const computedStyle = window.getComputedStyle(callWaiterBtn);
                isCallWaiterVisible =
                    computedStyle.display !== "none" &&
                    computedStyle.visibility !== "hidden" &&
                    callWaiterBtn.offsetParent !== null;
            }
        }

        // Set bottom position: 4.5rem if callWaiterBtn is visible, 1rem if hidden
        const bottomValue = isCallWaiterVisible ? "4.5rem" : "1rem";
        desktopCartBtn.style.bottom = bottomValue;
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCounter();
        this.renderNewCartModal();
    }

    // ========== NEW CART MODAL SYSTEM ==========

    initializeNewCartModal() {
        const cartCloseBtn = document.getElementById("newCartClose");
        const cartOverlay = document.getElementById("newCartModalOverlay");
        const cartCheckoutBtn = document.getElementById("newCartCheckoutBtn");

        // Close button
        if (cartCloseBtn) {
            cartCloseBtn.addEventListener("click", () => this.closeNewCartModal());
        }

        // Overlay click to close
        if (cartOverlay) {
            cartOverlay.addEventListener("click", (e) => {
                if (e.target === cartOverlay) {
                    this.closeNewCartModal();
                }
            });
        }

        // Checkout button
        if (cartCheckoutBtn) {
            cartCheckoutBtn.addEventListener("click", () => {
                // Çift tıklamayı engelle ve loading spinner göster
                if (cartCheckoutBtn.disabled) return;

                cartCheckoutBtn.disabled = true;
                cartCheckoutBtn.classList.add("is-loading");

                // Buton metnini sakla, spinner göster
                const labelSpan = cartCheckoutBtn.querySelector("span");
                const icon = cartCheckoutBtn.querySelector("i");
                if (labelSpan) {
                    labelSpan.dataset.originalText = labelSpan.textContent || "";
                }
                if (icon) {
                    icon.style.display = "none";
                }

                // Küçük bir gecikme ile yönlendir (spinner'ı görselleştirmek için)
                setTimeout(() => {
                    window.location.href = "siparis";
                }, 100);
            });
        }

        // Initialize promo code functionality
        this.initializePromoCode();

        // Expose to window
        if (!window.menuPage) {
            window.menuPage = {};
        }
        window.menuPage.openNewCartModal = this.openNewCartModal.bind(this);
        window.menuPage.closeNewCartModal = this.closeNewCartModal.bind(this);
        window.menuPage.renderNewCartModal = this.renderNewCartModal.bind(this);
        window.menuPage.updateCartQuantity = this.updateCartQuantity.bind(this);
        window.menuPage.removeFromCart = this.removeFromCart.bind(this);

        // Listen to cart updates to refresh modal if open
        if (window.EVENTS) {
            document.addEventListener(window.EVENTS.CART_UPDATED, () => {
                const modalOverlay = document.getElementById("newCartModalOverlay");
                if (modalOverlay && modalOverlay.classList.contains("active")) {
                    this.renderNewCartModal();
                }
            });
        }
    }

    openNewCartModal() {
        const modalOverlay = document.getElementById("newCartModalOverlay");
        if (!modalOverlay) return;

        // Modalı hemen aç; içerik sonra yüklensin (çok ürün varken gecikme olmasın)
        const cartItemsContainer = document.getElementById("newCartItems");
        const loadingText = (window.I18N && window.I18N.t) ? window.I18N.t("loading") : "Yükleniyor...";
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML =
                '<div class="new-cart-modal-loading"><div class="new-cart-modal-loading-spinner"></div><span>' +
                loadingText.replace(/</g, "&lt;") +
                "</span></div>";
        }
        modalOverlay.classList.add("active");
        document.body.style.overflow = "hidden";

        // İçeriği bir sonraki paint sonrası render et (modal önce görünsün)
        const self = this;
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                self.loadPromo();
                self.renderNewCartModal();
                // Kampanya satırı async yüklendiği için sepette tekrar güncelle (fetch tamamlansın)
                setTimeout(function () {
                    self.updateCampaignSelectVisibility();
                }, 350);
            });
        });
    }

    closeNewCartModal() {
        const modalOverlay = document.getElementById("newCartModalOverlay");
        if (!modalOverlay) return;

        modalOverlay.classList.remove("active");
        modalOverlay.style.opacity = "";
        const newCartBox = modalOverlay.querySelector(".new-cart-modal");
        if (newCartBox) newCartBox.style.transform = "";

        // Sadece başka modal yoksa scroll'u aç
        const productModal = document.querySelector(".product-modal-overlay");
        if (!productModal || !productModal.classList.contains("active")) {
            document.body.style.overflow = "";
        }
    }

    openOrdersModal() {
        // Helper function to check recent orders
        function hasRecentOrders(hours = 8) {
            try {
                const saved = localStorage.getItem("user_orders");
                const orders = saved ? JSON.parse(saved) : [];
                const now = Date.now();
                const hoursInMs = hours * 60 * 60 * 1000;
                return orders.some((order) => {
                    const orderTime =
                        order.timestamp || new Date(order.time).getTime() || now;
                    return now - orderTime < hoursInMs;
                });
            } catch (e) {
                return false;
            }
        }

        // Helper to load orders
        function loadOrdersFromHistory() {
            try {
                const saved = localStorage.getItem("user_orders");
                return saved ? JSON.parse(saved) : [];
            } catch (e) {
                return [];
            }
        }

        // Helper to delete order
        function deleteOrderFromHistory(orderId) {
            try {
                const orders = loadOrdersFromHistory();
                const filtered = orders.filter((o) => o.id !== orderId);
                localStorage.setItem("user_orders", JSON.stringify(filtered));
                return true;
            } catch (e) {
                return false;
            }
        }

        const orders = loadOrdersFromHistory();
        const translations = window.I18N?.getTranslations?.();
        const lang = window.I18N?.getPreferredLanguage?.() || "tr";
        const t = (key, fallback) =>
            translations?.[lang]?.[key] !== undefined
                ? translations[lang][key]
                : fallback;

        // Create or get modal
        let ordersModal = document.getElementById("ordersHistoryModal");
        if (!ordersModal) {
            ordersModal = document.createElement("div");
            ordersModal.id = "ordersHistoryModal";
            ordersModal.className = "orders-history-modal-overlay";
            document.body.appendChild(ordersModal);
        }

        // Sort orders by timestamp (newest first)
        const sortedOrders = [...orders].sort((a, b) => {
            const timeA = a.timestamp || new Date(a.time).getTime() || 0;
            const timeB = b.timestamp || new Date(b.time).getTime() || 0;
            return timeB - timeA;
        });

        let ordersHTML = `
      <div class="orders-history-modal">
        <button type="button" class="orders-history-close" id="ordersHistoryClose">
          <i class="fas fa-times"></i>
        </button>
        <div class="orders-history-header">
          <h2>${t("prev_orders_title", "Sipariş Geçmişi")}</h2>
        </div>
        <div class="orders-history-content" id="ordersHistoryContent">
    `;

        if (sortedOrders.length === 0) {
            ordersHTML += `
        <div class="orders-empty">
          <i class="fas fa-inbox"></i>
          <p>${t("prev_orders_empty", "Henüz sipariş geçmişiniz bulunmamaktadır.")}</p>
        </div>
      `;
        } else {
            sortedOrders.forEach((order, index) => {
                const itemsCount = order.items
                    ? order.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
                    : 0;
                const orderDate = order.time
                    ? new Date(order.time).toLocaleString("tr-TR")
                    : order.timestamp
                        ? new Date(order.timestamp).toLocaleString("tr-TR")
                        : "-";

                // Format order items
                let itemsHTML = "";
                if (order.items && order.items.length > 0) {
                    order.items.forEach((item) => {
                        const itemTotal = (item.price || 0) * (item.quantity || 1);
                        const itemOptions = item.options || {};

                        // Opsiyonları new-cart-item-options-list görünümü ile yaz
                        let optionsHTML = "";
                        const optionLines = [];

                        if (
                            itemOptions.selections &&
                            typeof itemOptions.selections === "object"
                        ) {
                            const selectionRecords = [];

                            Object.keys(itemOptions.selections).forEach((optionKey) => {
                                const list = Array.isArray(itemOptions.selections[optionKey])
                                    ? itemOptions.selections[optionKey]
                                    : [];

                                list.forEach((sel) => {
                                    if (!sel) return;
                                    const id = sel.id ?? sel.selectionId ?? null;
                                    selectionRecords.push({
                                        raw: sel,
                                        optionKey,
                                        optionId: sel.optionId || optionKey,
                                        id,
                                        name: sel.name || "",
                                        qty: parseInt(sel.qty ?? sel.quantity ?? "1", 10) || 1,
                                        isSubOption: !!sel.isSubOption,
                                        parentSelectionId: sel.parentSelectionId ?? null,
                                        depth: sel.depth ?? 0,
                                    });
                                });
                            });

                            // Derinliğe göre sırala
                            selectionRecords.sort((a, b) => (a.depth || 0) - (b.depth || 0));

                            const nodesById = {};
                            const rootNodes = [];

                            selectionRecords.forEach((rec) => {
                                const node = { rec, children: [] };
                                const idStr = rec.id !== null ? String(rec.id) : null;
                                if (idStr) {
                                    nodesById[idStr] = node;
                                } else {
                                    rootNodes.push(node);
                                }
                            });

                            // Parent-child ilişkilerini kur
                            Object.values(nodesById).forEach((node) => {
                                const rec = node.rec;
                                const parentSelId = rec.parentSelectionId ?? null;
                                if (
                                    rec.isSubOption &&
                                    parentSelId !== null &&
                                    nodesById[String(parentSelId)]
                                ) {
                                    nodesById[String(parentSelId)].children.push(node);
                                } else {
                                    rootNodes.push(node);
                                }
                            });

                            const resolveOptionTitle = (node) => {
                                const sel = node.rec.raw || {};
                                const optionKey = node.rec.optionKey;
                                let optionTitle = sel.optionTitle || optionKey;

                                if (optionTitle === optionKey) {
                                    const optionKeyLower = String(optionKey).toLowerCase();
                                    if (
                                        optionKeyLower.includes("size") ||
                                        optionKeyLower.includes("boyut")
                                    ) {
                                        optionTitle = "Boyut Seçimi";
                                    } else if (
                                        optionKeyLower.includes("extra") ||
                                        optionKeyLower.includes("ekstra") ||
                                        optionKeyLower.includes("malzeme")
                                    ) {
                                        optionTitle = "Ek Malzemeler";
                                    } else if (
                                        optionKeyLower.includes("sos") ||
                                        optionKeyLower.includes("sauce")
                                    ) {
                                        optionTitle = "Soslar";
                                    }
                                }

                                return optionTitle;
                            };

                            const renderNode = (node, level = 0) => {
                                const rec = node.rec;
                                const sel = rec.raw || {};
                                const name = rec.name || "";
                                if (!name) return;

                                const qty = rec.qty || 1;
                                const qtyPrefix = qty > 1 ? `${qty}x ` : "";
                                const optionTitle = resolveOptionTitle(node);

                                const depthClass = `depth-${Math.min(level, 3)}`;
                                if (optionTitle && optionTitle !== name) {
                                    optionLines.push(
                                        `<div class="cart-option-line ${depthClass}"><span class="cart-option-line-label">${qtyPrefix}${name}</span><small class="cart-option-label-extra">(${optionTitle})</small></div>`,
                                    );
                                } else {
                                    optionLines.push(
                                        `<div class="cart-option-line ${depthClass}">${qtyPrefix}${name}</div>`,
                                    );
                                }

                                if (Array.isArray(node.children) && node.children.length > 0) {
                                    node.children.forEach((child) =>
                                        renderNode(child, level + 1),
                                    );
                                }
                            };

                            rootNodes.forEach((node) => renderNode(node, 0));
                        }

                        // Eski format fallback
                        if (optionLines.length === 0) {
                            if (itemOptions.size) {
                                const sizeText =
                                    typeof itemOptions.size === "object"
                                        ? itemOptions.size.name || itemOptions.size
                                        : itemOptions.size;
                                if (sizeText) {
                                    optionLines.push(
                                        `<div class="cart-option-line depth-0">Boyut Seçimi: ${sizeText}</div>`,
                                    );
                                }
                            }
                            if (
                                itemOptions.extras &&
                                Array.isArray(itemOptions.extras) &&
                                itemOptions.extras.length > 0
                            ) {
                                const extrasText = itemOptions.extras
                                    .map((e) => (typeof e === "object" ? e.name || "" : e))
                                    .filter((e) => e)
                                    .join(", ");
                                if (extrasText) {
                                    optionLines.push(
                                        `<div class="cart-option-line depth-0">Ek Malzemeler: ${extrasText}</div>`,
                                    );
                                }
                            }
                        }

                        if (optionLines.length > 0) {
                            optionsHTML = `<div class="new-cart-item-options-list">${optionLines.join(
                                "",
                            )}</div>`;
                        }

                        const notesHTML =
                            itemOptions.notes && itemOptions.notes.trim()
                                ? `<p class="order-history-item-product-notes"><i class="fas fa-sticky-note"></i> ${itemOptions.notes.trim()}</p>`
                                : "";

                        itemsHTML += `
              <div class="order-history-item-product">
                <div class="order-history-item-product-info">
                  <h4>${item.name || ""} <span class="order-history-item-quantity">x${item.quantity || 1}</span></h4>
                  ${optionsHTML || ""}
                  ${notesHTML}
                </div>
                <div class="order-history-item-product-price">${itemTotal.toFixed(2)}</div>
              </div>
            `;
                    });
                }

                ordersHTML += `
          <div class="order-history-item" data-order-id="${order.id}">
            <div class="order-history-header-item">
              <div class="order-history-info">
                <h3>${t("order_info_order_code", "Sipariş Kodu")}: <strong>${order.code || order.id}</strong></h3>
                <p>${itemsCount} ${t("prev_orders_items", "ürün")} • ${orderDate}</p>
              </div>
              <div class="order-history-actions">
                <button type="button" class="order-history-toggle-items" data-order-index="${index}">
                  <i class="fas fa-chevron-down"></i>
                  <span>${t("prev_orders_show_items", "Ürünleri Gör")}</span>
                </button>
                <button type="button" class="order-history-delete" data-order-id="${order.id}">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <div class="order-history-items-container" id="orderItems${index}" style="display: none;">
              <div class="order-history-items-list">
                ${itemsHTML}
              </div>
            </div>
            <div class="order-history-details">
              <div class="order-history-total">
                <span>${t("order_summary_total", "Sipariş tutarı")}:</span>
                <strong>${(order.totals?.total || 0).toFixed(2)}</strong>
              </div>
            </div>
          </div>
        `;
            });
        }

        ordersHTML += `
        </div>
      </div>
    `;

        ordersModal.innerHTML = ordersHTML;
        ordersModal.classList.add("active");
        document.body.style.overflow = "hidden";

        // Close button
        const closeBtn = document.getElementById("ordersHistoryClose");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                ordersModal.classList.remove("active");
                document.body.style.overflow = "";
            });
        }

        // Toggle items buttons
        document.querySelectorAll(".order-history-toggle-items").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const orderIndex = btn.getAttribute("data-order-index");
                const itemsContainer = document.getElementById(
                    `orderItems${orderIndex}`,
                );
                const icon = btn.querySelector("i");
                const span = btn.querySelector("span");

                if (itemsContainer) {
                    const isHidden =
                        itemsContainer.style.display === "none" ||
                        !itemsContainer.style.display;
                    itemsContainer.style.display = isHidden ? "block" : "none";

                    if (icon) {
                        if (isHidden) {
                            icon.classList.remove("fa-chevron-down");
                            icon.classList.add("fa-chevron-up");
                        } else {
                            icon.classList.remove("fa-chevron-up");
                            icon.classList.add("fa-chevron-down");
                        }
                    }

                    if (span) {
                        span.textContent = isHidden
                            ? t("prev_orders_hide_items", "Ürünleri Gizle")
                            : t("prev_orders_show_items", "Ürünleri Gör");
                    }
                }
            });
        });

        // Delete buttons
        document.querySelectorAll(".order-history-delete").forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                const orderId = e.currentTarget.getAttribute("data-order-id");
                const confirmed = await window.Swal.fire({
                    title: t("order_delete_confirm_title", "Siparişi Sil"),
                    text: t(
                        "order_delete_confirm_message",
                        "Bu siparişi silmek istediğinize emin misiniz?",
                    ),
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: t("order_delete_confirm", "Evet, Sil"),
                    cancelButtonText: t("cancel", "İptal"),
                    confirmButtonColor: "#8C734B",
                    cancelButtonColor: "#8C734B",
                });

                if (confirmed.isConfirmed) {
                    const success = deleteOrderFromHistory(orderId);
                    if (success) {
                        await window.Swal.fire({
                            title: t("order_deleted_title", "Silindi"),
                            text: t("order_deleted_message", "Sipariş başarıyla silindi."),
                            icon: "success",
                            timer: 2000,
                            timerProgressBar: true,
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                        });
                        // Refresh modal
                        this.openOrdersModal();
                    }
                }
            });
        });
    }

    renderNewCartModal() {
        // Promoları her render'da localStorage'dan yeniden yükle (sayfa yenilemeden senkron)
        this.loadPromo();
        // Kampanyayı her render'da localStorage'dan yeniden yükle
        this.loadSelectedCampaign();
        const cartItems = window.globalCart
            ? window.globalCart.getItems()
            : this.cart;
        const cartItemsContainer = document.getElementById("newCartItems");
        const cartEmpty = document.getElementById("newCartEmpty");
        const cartSummary = document.getElementById("newCartSummary");
        const cartFooter = document.getElementById("newCartFooter");

        if (!cartItemsContainer) return;

        // Calculate total items count to check if cart is empty
        const totalItems =
            window.globalCart && typeof window.globalCart.getTotalItems === "function"
                ? window.globalCart.getTotalItems()
                : cartItems
                    ? cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
                    : 0;

        if (!cartItems || cartItems.length === 0 || totalItems === 0) {
            // Empty state
            // Get translations for multilingual support (define early for use in button)
            const translations = window.I18N?.getTranslations?.();
            const lang = window.I18N?.getPreferredLanguage?.() || "tr";
            const t = (key, fallback) =>
                translations?.[lang]?.[key] !== undefined
                    ? translations[lang][key]
                    : fallback;

            const cartTitleEl = document.querySelector(".new-cart-title");
            if (cartTitleEl) {
                cartTitleEl.textContent = t("cart_title", "Sepetim");
            }
            if (cartEmpty) cartEmpty.style.display = "block";
            if (cartItemsContainer) cartItemsContainer.innerHTML = "";
            if (cartSummary) cartSummary.style.display = "none";
            if (cartFooter) {
                cartFooter.style.display = "none";
                cartFooter.style.setProperty("display", "none", "important");
            }

            // Helper function to check recent orders
            function hasRecentOrders(hours = 8) {
                try {
                    const saved = localStorage.getItem("user_orders");
                    const orders = saved ? JSON.parse(saved) : [];
                    const now = Date.now();
                    const hoursInMs = hours * 60 * 60 * 1000;
                    return orders.some((order) => {
                        const orderTime =
                            order.timestamp || new Date(order.time).getTime() || now;
                        return now - orderTime < hoursInMs;
                    });
                } catch (e) {
                    return false;
                }
            }

            // Check if there are recent orders (within last 8 hours)
            if (hasRecentOrders(8)) {
                // Show "Previous Orders" button
                let prevOrdersBtn = document.getElementById("prevOrdersBtn");
                if (!prevOrdersBtn) {
                    prevOrdersBtn = document.createElement("button");
                    prevOrdersBtn.id = "prevOrdersBtn";
                    prevOrdersBtn.className = "prev-orders-btn";
                    prevOrdersBtn.innerHTML = `<i class="fas fa-history"></i><span>${t("prev_orders_btn", "Daha Önceki Siparişler")}</span>`;
                    prevOrdersBtn.addEventListener("click", () => {
                        this.closeNewCartModal();
                        this.openOrdersModal();
                    });
                    const cartContent = document.querySelector(".new-cart-content");
                    if (cartContent) {
                        cartContent.appendChild(prevOrdersBtn);
                    }
                }
                prevOrdersBtn.style.display = "flex";
            } else {
                const prevOrdersBtn = document.getElementById("prevOrdersBtn");
                if (prevOrdersBtn) {
                    prevOrdersBtn.style.display = "none";
                }
            }

            this.updateCampaignSelectVisibility();
            return;
        }

        // Hide empty state
        if (cartEmpty) cartEmpty.style.display = "none";
        if (cartSummary) cartSummary.style.display = "flex";
        if (cartFooter) cartFooter.style.display = "block";

        // Show/hide previous orders button based on recent orders
        // Helper function to check recent orders
        function hasRecentOrders(hours = 8) {
            try {
                const saved = localStorage.getItem("user_orders");
                const orders = saved ? JSON.parse(saved) : [];
                const now = Date.now();
                const hoursInMs = hours * 60 * 60 * 1000;
                return orders.some((order) => {
                    const orderTime =
                        order.timestamp || new Date(order.time).getTime() || now;
                    return now - orderTime < hoursInMs;
                });
            } catch (e) {
                return false;
            }
        }

        // Show "Previous Orders" button if there are recent orders (when cart has items)
        if (hasRecentOrders(8)) {
            let prevOrdersBtn = document.getElementById("prevOrdersBtn");
            if (!prevOrdersBtn) {
                prevOrdersBtn = document.createElement("button");
                prevOrdersBtn.id = "prevOrdersBtn";
                prevOrdersBtn.className = "prev-orders-btn";

                const translations = window.I18N?.getTranslations?.();
                const lang = window.I18N?.getPreferredLanguage?.() || "tr";
                const t = (key, fallback) =>
                    translations?.[lang]?.[key] !== undefined
                        ? translations[lang][key]
                        : fallback;

                prevOrdersBtn.innerHTML = `<i class="fas fa-history"></i><span>${t("prev_orders_btn", "Daha Önceki Siparişler")}</span>`;
                prevOrdersBtn.addEventListener("click", () => {
                    this.closeNewCartModal();
                    this.openOrdersModal();
                });
                // Add button to summary section
                if (cartSummary) {
                    cartSummary.appendChild(prevOrdersBtn);
                } else {
                    const cartContent = document.querySelector(".new-cart-content");
                    if (cartContent) {
                        cartContent.appendChild(prevOrdersBtn);
                    }
                }
            }
            prevOrdersBtn.style.display = "flex";
        } else {
            const prevOrdersBtn = document.getElementById("prevOrdersBtn");
            if (prevOrdersBtn) {
                prevOrdersBtn.style.display = "none";
            }
        }

        // Promo input her zaman görünür, birden fazla promosyon eklenebilsin
        const promoRow = document.querySelector(".promo-row");
        const promoInput = document.getElementById("promoCodeInput");
        const applyBtn = document.getElementById("applyPromoBtn");
        const errorMessage = document.getElementById("promoErrorMessage");
        if (promoRow) promoRow.style.display = "flex";
        if (promoInput) {
            promoInput.disabled = false;
            promoInput.style.backgroundColor = "#FAF8F2";
            if (promoInput.value.trim().length > 0 && applyBtn) {
                applyBtn.style.display = "block";
            } else if (applyBtn) {
                applyBtn.style.display = "none";
            }
        }
        if (errorMessage) errorMessage.style.display = "none";

        // Render items - sort by addedAt (newest first) or by ID to maintain order
        cartItemsContainer.innerHTML = "";
        let itemsTotal = 0;
        let itemsCount = 0;

        // Sort items: newest first (by addedAt) or by ID to maintain insertion order
        const sortedItems = [...cartItems].sort((a, b) => {
            // If both have addedAt, sort by date (newest first - en yeni en başta)
            if (a.addedAt && b.addedAt) {
                return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
            }
            // If only one has addedAt, prioritize it (newer items first)
            if (a.addedAt && !b.addedAt) return -1;
            if (!a.addedAt && b.addedAt) return 1;
            // If neither has addedAt, maintain original order
            return 0;
        });

        sortedItems.forEach((item) => {
            itemsTotal += (item.price || 0) * (item.quantity || 1);
            itemsCount += item.quantity || 1;

            const itemDiv = document.createElement("div");
            itemDiv.className = "new-cart-item";
            itemDiv.style.position = "relative";
            itemDiv.setAttribute("data-item-id", item.id);

            // Get product info first (needed for option titles)
            const productId = item.productId || item.id;
            const product = this.products.find((p) => p.id === productId);

            // Format options text - list format (option name + selections)
            let optionsHTML = "";
            let notesHTML = "";
            if (item.options) {
                const optionLines = [];

                // Yeni yapı: selections + hiyerarşi (isSubOption, parentSelectionId, depth, ...)
                if (
                    item.options.selections &&
                    typeof item.options.selections === "object"
                ) {
                    const selectionNodesById = {};
                    const rootNodes = [];

                    // Tüm seçimleri tek listeye topla ve node haritası oluştur
                    Object.keys(item.options.selections).forEach((optionKey) => {
                        const list = Array.isArray(item.options.selections[optionKey])
                            ? item.options.selections[optionKey]
                            : [];

                        list.forEach((sel) => {
                            if (!sel) return;
                            const selId = sel.id ?? sel.selectionId ?? null;
                            const node = {
                                sel,
                                optionKey,
                                children: [],
                            };
                            if (selId !== null) {
                                selectionNodesById[String(selId)] = node;
                            } else {
                                // id yoksa doğrudan root kabul et
                                rootNodes.push(node);
                            }
                        });
                    });

                    // Parent-child ilişkilerini kur
                    Object.values(selectionNodesById).forEach((node) => {
                        const sel = node.sel || {};
                        const parentSelId = sel.parentSelectionId ?? null;
                        if (
                            sel.isSubOption &&
                            parentSelId !== null &&
                            selectionNodesById[String(parentSelId)]
                        ) {
                            selectionNodesById[String(parentSelId)].children.push(node);
                        } else {
                            // Ana opsiyon
                            rootNodes.push(node);
                        }
                    });

                    // Option title bulucu (mevcut mantığı koru)
                    const resolveOptionTitle = (node) => {
                        const sel = node.sel || {};
                        const optionKey = node.optionKey;
                        let optionTitle = sel.optionTitle || optionKey;

                        if (product && product.options && Array.isArray(product.options)) {
                            const option = product.options.find(
                                (opt) =>
                                    String(opt.id) === String(sel.optionId || optionKey) ||
                                    opt.name === optionKey ||
                                    (opt.title &&
                                        opt.title.toLowerCase().replace(/\s+/g, "") ===
                                        String(optionKey).toLowerCase().replace(/\s+/g, "")),
                            );
                            if (option && option.title) {
                                optionTitle = option.title;
                            }
                        }

                        if (optionTitle === optionKey) {
                            const optionKeyLower = String(optionKey).toLowerCase();
                            if (
                                optionKeyLower.includes("size") ||
                                optionKeyLower.includes("boyut")
                            ) {
                                optionTitle = "Boyut Seçimi";
                            } else if (
                                optionKeyLower.includes("extra") ||
                                optionKeyLower.includes("ekstra") ||
                                optionKeyLower.includes("malzeme")
                            ) {
                                optionTitle = "Ek Malzemeler";
                            } else if (
                                optionKeyLower.includes("sos") ||
                                optionKeyLower.includes("sauce")
                            ) {
                                optionTitle = "Soslar";
                            }
                        }

                        return optionTitle;
                    };

                    // Ağaç yapısını satırlara dök
                    const renderNode = (node, level = 0) => {
                        const sel = node.sel || {};
                        const name = sel.name || "";
                        if (!name) return;

                        const qty = parseInt(sel.qty || "0", 10) || 0;
                        const qtyPrefix = qty > 1 ? `${qty}x ` : "";
                        const optionTitle = resolveOptionTitle(node);

                        // Satır metni: "2x Acı Sos (Ek Malzemeler)" gibi (parantez içi küçük)
                        const depthClass = `depth-${Math.min(level, 3)}`;
                        if (optionTitle && optionTitle !== name) {
                            optionLines.push(
                                `<div class="cart-option-line ${depthClass}"><span class="cart-option-line-label">${qtyPrefix}${name}</span><small class="cart-option-label-extra">(${optionTitle})</small></div>`,
                            );
                        } else {
                            optionLines.push(
                                `<div class="cart-option-line ${depthClass}">${qtyPrefix}${name}</div>`,
                            );
                        }

                        if (Array.isArray(node.children) && node.children.length > 0) {
                            node.children.forEach((child) => renderNode(child, level + 1));
                        }
                    };

                    // Root node'ları render et
                    rootNodes.forEach((node) => renderNode(node, 0));
                }

                // Eski format için fallback (size + extras), eğer hiç satır üretilmediyse
                if (optionLines.length === 0) {
                    if (item.options.size) {
                        const sizeText =
                            typeof item.options.size === "object"
                                ? item.options.size.name || item.options.size
                                : item.options.size;
                        if (sizeText) {
                            optionLines.push(
                                `<div class="cart-option-line depth-0">Boyut Seçimi: ${sizeText}</div>`,
                            );
                        }
                    }
                    if (
                        item.options.extras &&
                        Array.isArray(item.options.extras) &&
                        item.options.extras.length > 0
                    ) {
                        const extrasText = item.options.extras
                            .map((e) => (typeof e === "object" ? e.name || "" : e))
                            .filter((e) => e)
                            .join(", ");
                        if (extrasText) {
                            optionLines.push(
                                `<div class="cart-option-line depth-0">Ek Malzemeler: ${extrasText}</div>`,
                            );
                        }
                    }
                }

                if (optionLines.length > 0) {
                    optionsHTML = `<div class="new-cart-item-options-list">${optionLines.join(
                        "",
                    )}</div>`;
                }

                // Show notes if available
                if (item.options.notes && item.options.notes.trim()) {
                    notesHTML = `<div class="new-cart-item-notes">
                        <i class="fas fa-sticky-note"></i>
                        <span>${item.options.notes.trim()}</span>
                    </div>`;
                }
            }

            const itemPrice = (item.price || 0) * (item.quantity || 1);
            const basePrice = item.basePrice || item.price || 0;
            // Get oldPrice from product or item
            const productOldPrice =
                product && product.oldPrice ? product.oldPrice : null;
            const itemOldPrice = item.oldPrice || null;
            const oldPrice = itemOldPrice || productOldPrice;
            // Calculate old total price if oldPrice exists
            const oldTotalPrice = oldPrice ? oldPrice * (item.quantity || 1) : null;
            const hasDiscount = oldTotalPrice && oldTotalPrice > itemPrice;

            // Get translations for multilingual support
            const translations = window.I18N?.getTranslations?.();
            const lang = window.I18N?.getPreferredLanguage?.() || "tr";
            const t = (key, fallback) =>
                translations?.[lang]?.[key] !== undefined
                    ? translations[lang][key]
                    : fallback;

            itemDiv.innerHTML = `
                <div class="new-cart-item-image">
                    <div class="image-loading-spinner">
                        <div class="spinner"></div>
                    </div>
                    <img src="" alt="${item.name || ""}" class="lazy-image${item.image_source === "company_logo" ? " logo-fallback-image" : ""}" data-src="${item.image || ""}">
                </div>
                <div class="new-cart-item-content">
                    <h4 class="new-cart-item-name">${item.name || ""}</h4>
                    <div class="new-cart-item-details">
                        ${optionsHTML || ""}
                        ${notesHTML || ""}
                    </div>
                    <div class="new-cart-item-price-row">
                        <div class="new-cart-item-price">
                            ${itemPrice.toFixed(2)}                            ${hasDiscount ? `<span class="new-cart-item-old-price">${oldTotalPrice.toFixed(2)}</span>` : ""}
                        </div>
                        <div class="new-cart-item-actions">
                            <button type="button" class="new-cart-item-change-btn" data-item-id="${item.id}" data-product-id="${productId}">
                                ${t("cart_change_btn", "Değiştir")}
                            </button>
                            <div class="new-cart-item-quantity">
                                <button type="button" class="new-cart-item-quantity-btn" data-action="decrease" data-item-id="${item.id}">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="new-cart-item-quantity-value">${item.quantity || 1}</span>
                                <button type="button" class="new-cart-item-quantity-btn" data-action="increase" data-item-id="${item.id}">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" class="new-cart-item-remove" data-item-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;

            cartItemsContainer.appendChild(itemDiv);

            // Add event listeners for change, quantity and remove buttons
            const changeBtn = itemDiv.querySelector(".new-cart-item-change-btn");
            const decreaseBtn = itemDiv.querySelector('[data-action="decrease"]');
            const increaseBtn = itemDiv.querySelector('[data-action="increase"]');
            const removeBtn = itemDiv.querySelector(".new-cart-item-remove");

            if (changeBtn) {
                changeBtn.addEventListener("click", () => {
                    const cartItemId = changeBtn.getAttribute("data-item-id");
                    const productId = changeBtn.getAttribute("data-product-id");
                    if (
                        window.menuPage &&
                        window.menuPage.openProductModal &&
                        cartItemId &&
                        productId
                    ) {
                        // Don't close cart modal, just open product modal with cart item
                        window.menuPage.openProductModal(parseInt(productId), cartItemId);
                    }
                });
            }

            if (decreaseBtn) {
                decreaseBtn.addEventListener("click", () => {
                    const currentQty = item.quantity || 1;
                    if (window.menuPage && window.menuPage.updateCartQuantity) {
                        window.menuPage.updateCartQuantity(item.id, currentQty - 1);
                    }
                });
            }

            if (increaseBtn) {
                increaseBtn.addEventListener("click", () => {
                    const currentQty = item.quantity || 1;
                    if (window.menuPage && window.menuPage.updateCartQuantity) {
                        window.menuPage.updateCartQuantity(item.id, currentQty + 1);
                    }
                });
            }

            if (removeBtn) {
                removeBtn.addEventListener("click", () => {
                    if (window.menuPage && window.menuPage.removeFromCart) {
                        window.menuPage.removeFromCart(item.id);
                    }
                });
            }

            // Load image with spinner (similar to product modal)
            const itemImage = itemDiv.querySelector(".new-cart-item-image img");
            const itemSpinner = itemDiv.querySelector(
                ".new-cart-item-image .image-loading-spinner",
            );
            const imageSrc = itemImage ? itemImage.getAttribute("data-src") : null;

            if (imageSrc && itemImage && itemSpinner) {
                // Show spinner
                itemSpinner.style.display = "flex";
                itemImage.classList.add("lazy-image");

                // Load image
                const tempImg = new Image();

                tempImg.onload = () => {
                    itemImage.src = imageSrc;
                    itemImage.classList.add("loaded");
                    itemImage.classList.remove("lazy-image");
                    itemSpinner.style.display = "none";
                };

                tempImg.onerror = () => {
                    itemSpinner.style.display = "none";
                    itemImage.src = "assets/images/brand/favicon.png";
                    itemImage.classList.remove("lazy-image");
                };

                tempImg.src = imageSrc;
            } else if (itemSpinner) {
                itemSpinner.style.display = "none";
            }
        });

        // Update cart title with item count
        const cartTitleEl = document.querySelector(".new-cart-title");
        if (cartTitleEl) {
            // Get translations for multilingual support
            const translations = window.I18N?.getTranslations?.();
            const lang = window.I18N?.getPreferredLanguage?.() || "tr";
            const t = (key, fallback) =>
                translations?.[lang]?.[key] !== undefined
                    ? translations[lang][key]
                    : fallback;

            const cartTitleText = t("cart_title", "Sepetim");
            cartTitleEl.textContent = `${cartTitleText} (${itemsCount})`;
        }

        // Update totals with promo discount
        this.updateCartTotals(itemsTotal, itemsCount);
        // Kampanya motorunu güncelle; sonuç gelince toplamları yeniden çiz
        if (itemsTotal > 0 && itemsCount > 0) {
            this.loadPromotionEngineState().then(() => this.updateCartTotals(itemsTotal, itemsCount));
        }
        // Kampanya butonu görünürlüğünü güncelle
        this.updateCampaignSelectVisibility();
    }

    // ========== PROMO CODE SYSTEM ==========

    // Kampanya motorundan kupon uyumluluk bilgisini al
    async loadPromotionEngineState(options) {
        if (isTahmisciBackendCatalogMode()) {
            this.selectedCampaignValidation = null;
            this.appliedCampaigns = [];
            this.engineCampaignDiscountCents = 0;
            this.freeItems = [];
            this.appliedPromotions = [];
            this.couponAllowed = false;
            this.couponBlockReason = '';
            return;
        }
        try {
            const orderType = localStorage.getItem("menuOrderType") || "tableOrder";
            // Geçmiş siparişleri localStorage’dan al (birikimli kampanya için)
            const companyId = parseInt(localStorage.getItem("menuBranchId") || localStorage.getItem("menuCompanyId") || "0", 10) || 0;
            const cartItems = window.globalCart ? (window.globalCart.getItems && window.globalCart.getItems()) : (this.cart || []);
            const list = Array.isArray(cartItems) ? cartItems : [];
            const items = list.map((item) => ({
                productId: item.productId || item.id || 0,
                categoryId: item.categoryId || item.category_id || 0,
                quantity: Number(item.quantity) || 1,
                unitPrice: item.price != null ? item.price : (item.unitPrice != null ? item.unitPrice : 0),
                price: item.price != null ? item.price : (item.unitPrice != null ? item.unitPrice : 0),
                name: item.name || item.title || "Ürün",
            }));
            const userId = (this.currentUser && this.currentUser.id) ? this.currentUser.id : (localStorage.getItem("userId") ? parseInt(localStorage.getItem("userId"), 10) : null);
            const userPayload = userId ? { id: userId } : null;
            if (userPayload && this.currentUser) {
                if (this.currentUser.phone) userPayload.phone = this.currentUser.phone;
                if (this.currentUser.email) userPayload.email = this.currentUser.email;
            }
            if (userPayload && !userPayload.phone && localStorage.getItem("userPhone")) userPayload.phone = localStorage.getItem("userPhone");
            if (userPayload && !userPayload.email && localStorage.getItem("userEmail")) userPayload.email = localStorage.getItem("userEmail");
            const body = {
                order: { orderType, items, branchId: companyId, companyId, is_first_order: localStorage.getItem("is_first_order") === "true", visit_count: parseInt(localStorage.getItem("visit_count") || "0", 10), selected_campaign: this.selectedCampaign || null, user: userPayload },
                company_id: companyId,
                context: { customer: { is_first_order: localStorage.getItem("is_first_order") === "true", visit_count: parseInt(localStorage.getItem("visit_count") || "0", 10) } },
            };
            if ((options && options.skipAutoCampaigns === true) || localStorage.getItem("yeppos_skip_auto_campaigns") === "1") body.skip_auto_campaigns = true;
            const resp = await fetch(getSiteRoot() + "/yeppanel/db/ajax/web/promotion-engine.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await resp.json();
            if (!data || !data.success) return;
            const validation = data.selected_campaign_validation;
            this.selectedCampaignValidation = validation || null;
            if (validation && validation.eligible === false && validation.reason) {
                if (typeof showSwalToast === "function") showSwalToast(validation.reason, "warning", 4500);
                this.saveSelectedCampaign(null);
            }
            this.appliedCampaigns = Array.isArray(data.applied_campaigns) ? data.applied_campaigns : [];
            this.engineCampaignDiscountCents = typeof data.campaign_discount_total_cents === "number" ? data.campaign_discount_total_cents : 0;
            this.freeItems = Array.isArray(data.free_items) ? data.free_items : [];
            this.appliedPromotions = Array.isArray(data.applied_promotions) ? data.applied_promotions : this.appliedCampaigns;
            this.couponAllowed = data.coupon_allowed !== false;
            this.couponBlockReason = data.coupon_block_reason || "";
            this.applyCouponPolicyToMenuInput();
        } catch (e) {
            this.appliedCampaigns = [];
            this.engineCampaignDiscountCents = 0;
            this.freeItems = [];
        }
    }

    // Kupon input'unu kampanya kuralına göre aç/kapat
    applyCouponPolicyToMenuInput() {
        const promoInput = document.getElementById("promoCodeInput");
        const applyBtn = document.getElementById("applyPromoBtn");
        const errorMessage = document.getElementById("promoErrorMessage");
        if (!promoInput) return;

        const reason =
            this.couponBlockReason || "Kupon bu kampanya ile kullanılamaz";

        if (this.couponAllowed) {
            promoInput.disabled = false;
            if (applyBtn) applyBtn.disabled = false;
            if (errorMessage) errorMessage.style.display = "none";
            return;
        }

        promoInput.disabled = true;
        if (applyBtn) {
            applyBtn.disabled = true;
            applyBtn.style.display = "none";
        }
        if (errorMessage) {
            errorMessage.textContent = reason;
            errorMessage.style.display = "block";
        }
    }

    // =========================
    // Kampanya seçim sistemi
    // =========================
    loadSelectedCampaign() {
        try {
            const raw = localStorage.getItem("yeppos_selected_campaign")
            this.selectedCampaign = raw ? JSON.parse(raw) : null;
        } catch (e) {
            this.selectedCampaign = null;
        }
    }

    saveSelectedCampaign(campaign) {
        try {
            if (campaign) {
                try { localStorage.removeItem("yeppos_skip_auto_campaigns"); } catch (e) { }
                const json = JSON.stringify(campaign);
                localStorage.setItem("yeppos_selected_campaign", json);
                try { if (typeof window.refreshOrderPageFromStorage === "function") window.refreshOrderPageFromStorage(); } catch (e) { }
            } else {
                localStorage.removeItem("yeppos_selected_campaign");
            }
        } catch (e) {
            // ignore
        }
        this.selectedCampaign = campaign || null;
    }

    moneyToCents(value) {
        if (value == null) return 0;
        const s = String(value).trim().replace(",", ".");
        const m = s.match(/^(-)?(\d+)(?:\.(\d{0,}))?$/);
        if (!m) return 0;
        const sign = m[1] ? -1 : 1;
        const intPart = m[2] || "0";
        const fracRaw = m[3] || "";
        const frac2 = (fracRaw + "00").slice(0, 2);
        const cents = sign * (Number(intPart) * 100 + Number(frac2));
        return Number.isFinite(cents) ? cents : 0;
    }

    centsToMoneyText(cents) {
        const n = Number(cents) || 0;
        return (n / 100).toFixed(2);
    }

    calcCampaignDiscountCents(itemsSubtotalCents) {
        if (!this.selectedCampaign) return 0;
        const subtotal = Math.max(Number(itemsSubtotalCents) || 0, 0);
        const type = String(this.selectedCampaign.discount_type || "fixed");
        const val = Number(this.selectedCampaign.discount_value || 0);
        let discount = 0;
        if (type === "percentage") {
            discount = Math.round((subtotal * val) / 100);
        } else if (type === "fixed") {
            discount = this.moneyToCents(val);
        } else if (type === "free_shipping") {
            discount = 0;
        }
        return Math.min(discount, subtotal);
    }

    async fetchCampaigns() {
        if (isTahmisciBackendCatalogMode()) return [];
        const cacheKey = "__menuCampaignsCache";
        const cacheMaxAge = 10000;
        const now = Date.now();
        if (
            window[cacheKey] &&
            window[cacheKey].ts &&
            now - window[cacheKey].ts < cacheMaxAge
        ) {
            return window[cacheKey].data || [];
        }
        try {
            const lang = getAjaxLang();
            const resp = await fetch(getSiteRoot() + "/yeppanel/db/ajax/web/campaigns.php?lang=" + encodeURIComponent(lang));
            const data = await resp.json();
            let list = [];
            if (Array.isArray(data?.data)) {
                list = data.data;
            } else if (data?.data && Array.isArray(data.data.campaigns)) {
                list = data.data.campaigns;
            }
            window[cacheKey] = { data: list, ts: now };
            return list;
        } catch (e) {
            return [];
        }
    }

    async hasActivePromotions() {
        if (isTahmisciBackendCatalogMode()) return false;
        const cacheKey = "__menuPromotionsAvailabilityCache";
        const cacheMaxAge = 10000;
        const now = Date.now();
        const branchId = localStorage.getItem("menuBranchId") || localStorage.getItem("menuCompanyId") || "";
        if (
            window[cacheKey] &&
            window[cacheKey].ts &&
            window[cacheKey].branchId === branchId &&
            now - window[cacheKey].ts < cacheMaxAge
        ) {
            return window[cacheKey].hasActive;
        }
        try {
            const resp = await fetch(getSiteRoot() + "/yeppanel/db/ajax/web/validate-promo-code.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mode: "availability", branch_id: branchId ? Number(branchId) : 0 }),
            });
            const data = await resp.json();
            const hasActive = !!(data && data.success && data.has_active_promotions);
            window[cacheKey] = { hasActive, branchId, ts: now };
            return hasActive;
        } catch (e) {
            return false;
        }
    }

    isCampaignEligible(campaign, itemsSubtotalCents, orderType, branchId) {
        const branches = Array.isArray(campaign.branches) ? campaign.branches : [];
        if (branches.length > 0 && branchId && orderType !== "delivery") {
            const branchIdNum = Number(branchId);
            const hasBranch = branches.some((b) => b && Number(b.id) === branchIdNum);
            if (!hasBranch) return false;
        }
        const types = Array.isArray(campaign.order_types)
            ? campaign.order_types
            : [];
        if (types.length > 0 && orderType) {
            if (!types.includes(orderType)) return false;
        }
        const minCents = Number(campaign.min_subtotal_cents || 0);
        return itemsSubtotalCents >= minCents;
    }

    buildCampaignDetailHtml(campaign) {
        const translations = window.I18N?.getTranslations?.();
        const lang = window.I18N?.getPreferredLanguage?.() || "tr";
        const t = (key, fallback) =>
            translations?.[lang]?.[key] !== undefined
                ? translations[lang][key]
                : fallback;
        const orderTypeToLabel = (key) => {
            const k = String(key || "").toLowerCase();
            if (k === "takeaway") return t("order_type_takeaway", "Gel-Al");
            if (k === "delivery") return t("order_type_delivery", "Paket");
            if (k === "tableorder") return t("order_type_tableOrder", "Masada");
            return key;
        };
        const startStr = campaign.startDate
            ? new Date(campaign.startDate).toLocaleDateString("tr-TR")
            : "—";
        const endStr = campaign.endDate
            ? new Date(campaign.endDate).toLocaleDateString("tr-TR")
            : "—";
        const terms = Array.isArray(campaign.terms) ? campaign.terms : [];
        const couponPolicy = campaign.coupon_policy;
        const couponText =
            couponPolicy && couponPolicy.allow_coupon === false
                ? t("campaign_coupon_no", "Kuponla birlikte kullanılamaz")
                : t("campaign_coupon_yes", "Kuponla birlikte kullanılabilir");
        const termsHtml = terms
            .map((term) => `<li>${String(term).replace(/</g, "&lt;")}</li>`)
            .join("");
        const minCents = Number(campaign.min_subtotal_cents);
        const minStr =
            minCents > 0 ? this.centsToMoneyText(minCents).replace(".", ",") : "—";
        const discountType = String(campaign.discount_type || "").toLowerCase();
        const discountVal = Number(campaign.discount_value);
        const discountStr =
            discountType === "percentage"
                ? "%" + discountVal
                : discountVal > 0
                    ? discountVal.toFixed(2).replace(".", ",")
                    : "—";
        const orderTypes = Array.isArray(campaign.order_types) ? campaign.order_types : (Array.isArray(campaign.channels) ? campaign.channels : (Array.isArray(campaign.campaigns_channels) ? campaign.campaigns_channels : []));
        const orderTypesLabel = orderTypes.length > 0
            ? orderTypes.map((k) => orderTypeToLabel(k)).join(", ")
            : t("campaign_order_types_all", "Tümü");
        return `
      <div class="campaign-detail-line">
        <div class="campaign-detail-pair">
          <span class="campaign-detail-label">${t("campaign_min_subtotal", "Min. sepet tutarı")}</span>
          <span class="campaign-detail-value">${minStr}</span>
        </div>
        <div class="campaign-detail-pair">
          <span class="campaign-detail-label">${t("campaign_discount", "İndirim")}</span>
          <span class="campaign-detail-value">${discountStr}</span>
        </div>
      </div>
      <div class="campaign-detail-line">
        <div class="campaign-detail-pair">
          <span class="campaign-detail-label">${t("campaign_start_date", "Başlangıç tarihi")}</span>
          <span class="campaign-detail-value">${startStr}</span>
        </div>
        <div class="campaign-detail-pair">
          <span class="campaign-detail-label">${t("campaign_end_date", "Bitiş tarihi")}</span>
          <span class="campaign-detail-value">${endStr}</span>
        </div>
      </div>
      <div class="campaign-detail-row">
        <span class="campaign-detail-label">${t("campaign_order_types_label", "Sipariş tipleri")}</span>
        <span class="campaign-detail-value">${orderTypesLabel.replace(/</g, "&lt;")}</span>
      </div>
      <div class="campaign-detail-row">
        <span class="campaign-detail-label">${t("campaign_coupon_usage", "Kuponla kullanım")}</span>
        <span class="campaign-detail-value">${couponText}</span>
      </div>
      ${terms.length ? `<div class="campaign-detail-row campaign-detail-terms"><span class="campaign-detail-label">${t("campaign_terms", "Katılım şartları")}</span><ul class="campaign-detail-list">${termsHtml}</ul></div>` : ""}
    `;
    }

    renderCampaignCard(campaign, eligible, onApply, isApplied = false) {
        const translations = window.I18N?.getTranslations?.();
        const lang = window.I18N?.getPreferredLanguage?.() || "tr";
        const t = (key, fallback) =>
            translations?.[lang]?.[key] !== undefined
                ? translations[lang][key]
                : fallback;
        const btnText = isApplied
            ? t("campaign_applied_btn", "Uygulandı")
            : eligible
                ? t("campaign_apply_btn", "Uygula")
                : t("campaign_detail_btn", "Detay");
        const card = document.createElement("div");
        card.className = "campaign-card";
        card.innerHTML = `
      <div class="campaign-card-top">
        <div class="campaign-card-icon">
          <i class="fas fa-gift"></i>
        </div>
        <div class="campaign-card-content">
          <div class="campaign-card-title">${(campaign.title || "Kampanya").replace(/</g, "&lt;")}</div>
          <div class="campaign-card-desc">${(campaign.fullDescription || campaign.description || "").replace(/</g, "&lt;")}</div>
        </div>
        <button type="button" class="campaign-card-action">
          ${btnText}
        </button>
      </div>
      <button type="button" class="campaign-card-toggle" aria-expanded="false">
        <i class="fas fa-chevron-down campaign-card-toggle-icon"></i>
        <span>${t("campaign_detail_toggle", "Kampanya detayı")}</span>
      </button>
      <div class="campaign-card-detail" hidden>
        <div class="campaign-card-detail-inner">${this.buildCampaignDetailHtml(campaign)}</div>
      </div>
    `;
        const actionBtn = card.querySelector(".campaign-card-action");
        if (isApplied) actionBtn.classList.add("campaign-card-action--applied");
        if (isApplied || !eligible) actionBtn.setAttribute("disabled", "disabled");
        actionBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (eligible && !isApplied) onApply();
        });
        const toggleBtn = card.querySelector(".campaign-card-toggle");
        const detailEl = card.querySelector(".campaign-card-detail");
        const iconEl = card.querySelector(".campaign-card-toggle-icon");
        toggleBtn.addEventListener("click", () => {
            const isOpen = toggleBtn.getAttribute("aria-expanded") === "true";
            if (isOpen) {
                detailEl.hidden = true;
                toggleBtn.setAttribute("aria-expanded", "false");
                if (iconEl) iconEl.classList.remove("campaign-card-toggle-icon--open");
            } else {
                detailEl.hidden = false;
                toggleBtn.setAttribute("aria-expanded", "true");
                if (iconEl) iconEl.classList.add("campaign-card-toggle-icon--open");
            }
        });
        return card;
    }

    async openCampaignModalForMenu() {
        const modal = document.getElementById("campaignModal");
        const listReady = document.getElementById("campaignListReady");
        const listEligible = document.getElementById("campaignListEligible");
        if (!modal || !listReady || !listEligible) return;

        // Kupon uygulanmışsa kampanya seçimine izin verme
        if (Array.isArray(this.appliedPromos) && this.appliedPromos.length > 0) {
            const translations = window.I18N?.getTranslations?.();
            const lang = window.I18N?.getPreferredLanguage?.() || "tr";
            const t = (key, fallback) =>
                translations?.[lang]?.[key] !== undefined
                    ? translations[lang][key]
                    : fallback;
            if (window.Swal && typeof window.Swal.fire === "function") {
                window.Swal.fire({
                    icon: "warning",
                    title: t("campaign_blocked_by_coupon_title", "Kampanya Uygulanamaz"),
                    text: t(
                        "campaign_blocked_by_coupon_desc",
                        "Kupon kullandığınız için kampanya sizin için geçerli değil.",
                    ),
                    confirmButtonText: t("ok", "Tamam"),
                });
            }
            return;
        }

        listReady.innerHTML = "";
        listEligible.innerHTML = "";

        // Her açılışta run-id artır; sadece en son açılışın cevabı listelensin (tekrarları önle)
        window.__campaignModalRunId = (window.__campaignModalRunId || 0) + 1;
        const myRunId = window.__campaignModalRunId;

        let campaigns = await this.fetchCampaigns();
        if (myRunId !== window.__campaignModalRunId) return;
        listReady.innerHTML = "";
        listEligible.innerHTML = "";

        // Aynı kampanyanın birden fazla görünmesini engelle: ID'ye göre tekil listele
        const seenIds = new Set();
        campaigns = campaigns.filter((c) => {
            const id = c?.id != null ? String(c.id) : "";
            if (!id || seenIds.has(id)) return false;
            seenIds.add(id);
            return true;
        });
        if (!campaigns.length) {
            modal.classList.add("active");
            return;
        }

        const branchId = localStorage.getItem("menuBranchId");
        const orderType = localStorage.getItem("menuOrderType") || "tableOrder";
        let itemsSubtotalCents = this.moneyToCents(
            document.getElementById("cartItemsTotal")?.textContent || "0",
        );
        if (itemsSubtotalCents <= 0) {
            const cartItems = window.globalCart ? window.globalCart.getItems() : this.cart;
            const list = Array.isArray(cartItems) ? cartItems : [];
            itemsSubtotalCents = list.reduce((sum, item) => {
                const qty = Number(item.quantity || 0) || 0;
                const priceCents = this.moneyToCents(item.price);
                return sum + priceCents * qty;
            }, 0);
        }

        campaigns.forEach((c) => {
            if (String(c.status || "") !== "active") return;
            const eligible = this.isCampaignEligible(
                c,
                itemsSubtotalCents,
                orderType,
                branchId,
            );
            const isApplied =
                this.selectedCampaign &&
                String(this.selectedCampaign.id) === String(c.id);
            const card = this.renderCampaignCard(
                c,
                eligible,
                () => {
                    this.applyCampaignSelection(c);
                    modal.classList.remove("active");
                },
                isApplied,
            );
            if (eligible) {
                listReady.appendChild(card);
            } else {
                listEligible.appendChild(card);
            }
        });

        modal.classList.add("active");
    }

    applyCampaignSelection(campaign) {
        // Kupon uygulanmışsa kampanya seçimine izin verme
        if (Array.isArray(this.appliedPromos) && this.appliedPromos.length > 0) {
            const translations = window.I18N?.getTranslations?.();
            const lang = window.I18N?.getPreferredLanguage?.() || "tr";
            const t = (key, fallback) =>
                translations?.[lang]?.[key] !== undefined
                    ? translations[lang][key]
                    : fallback;
            if (window.Swal && typeof window.Swal.fire === "function") {
                window.Swal.fire({
                    icon: "warning",
                    title: t("campaign_blocked_by_coupon_title", "Kampanya Uygulanamaz"),
                    text: t(
                        "campaign_blocked_by_coupon_desc",
                        "Kupon kullandığınız için kampanya sizin için geçerli değil.",
                    ),
                    confirmButtonText: t("ok", "Tamam"),
                });
            }
            return;
        }
        this.saveSelectedCampaign(campaign);
        this.renderNewCartModal();

        // Kampanya kupon politikasını stabil uygula (geçişlerde durum sıfırlansın)
        if (campaign?.coupon_policy?.allow_coupon === false) {
            this.couponAllowed = false;
            this.couponBlockReason = campaign.coupon_policy.description || "";
        } else {
            this.couponAllowed = true;
            this.couponBlockReason = "";
        }
        this.applyCouponPolicyToMenuInput();
    }

    removeCampaignSelection() {
        this.saveSelectedCampaign(null);
        try { localStorage.setItem("yeppos_skip_auto_campaigns", "1"); } catch (e) { }
        this.renderNewCartModal();
        // Kampanya kaldır: motor otomatik uygulama yapmasın, indirim sıfırlansın
        this.loadPromotionEngineState({ skipAutoCampaigns: true }).then(() => {
            const cartItems = window.globalCart ? window.globalCart.getItems() : this.cart;
            const list = Array.isArray(cartItems) ? cartItems : [];
            const itemsTotal = list.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0);
            const itemsCount = list.reduce((s, i) => s + (Number(i.quantity) || 1), 0);
            this.updateCartTotals(itemsTotal, itemsCount);
        });
        // Sipariş sayfası açıksa kampanya kaldırma senkronla
        try {
            if (typeof window.refreshOrderPageFromStorage === "function") window.refreshOrderPageFromStorage();
        } catch (e) { }
    }

    async updateCampaignSelectVisibility() {
        const row = document.getElementById("menuCampaignSelectRow");
        const promoRow = document.getElementById("promoCodeInput")?.closest(".promo-row");
        if (!row && !promoRow) return;
        const cartItems = window.globalCart ? window.globalCart.getItems() : this.cart;
        const cartItemsList = Array.isArray(cartItems) ? cartItems : [];
        const totalFromCart = window.globalCart && typeof window.globalCart.getTotalItems === "function"
            ? window.globalCart.getTotalItems()
            : cartItemsList.reduce((s, i) => s + (Number(i.quantity) || 1), 0);
        const hasCartItems = cartItemsList.length > 0 || (typeof totalFromCart === "number" && totalFromCart > 0);
        if (!hasCartItems) {
            if (row) row.style.display = "none";
            if (promoRow) promoRow.style.display = "none";
            return;
        }
        const campaigns = await this.fetchCampaigns();
        const branchId = localStorage.getItem("menuBranchId");
        const orderType = localStorage.getItem("menuOrderType") || "tableOrder";
        const itemsSubtotalCents = cartItemsList.reduce((sum, item) => {
            const qty = Number(item.quantity || 0) || 0;
            const priceCents = this.moneyToCents(item.price);
            return sum + priceCents * qty;
        }, 0);
        const hasAny = Array.isArray(campaigns) && campaigns.length > 0 && campaigns.some((c) => {
            if (String(c.status || "") !== "active") return false;
            const branches = Array.isArray(c.branches) ? c.branches : [];
            if (branches.length > 0 && branchId) {
                const branchIdNum = Number(branchId);
                if (!branches.some((b) => b && Number(b.id) === branchIdNum)) return false;
            }
            const types = Array.isArray(c.order_types) ? c.order_types : [];
            if (types.length > 0 && orderType) {
                if (!types.includes(orderType)) return false;
            }
            return true;
        });
        if (row) row.style.display = hasCartItems && hasAny ? "flex" : "none";
        const hasPromotions = await this.hasActivePromotions();
        if (promoRow) promoRow.style.display = hasCartItems && hasPromotions ? "flex" : "none";
        if (this.selectedCampaign) {
            const eligible = this.isCampaignEligible(
                this.selectedCampaign,
                itemsSubtotalCents,
                orderType,
                branchId,
            );
            if (!hasCartItems || !hasAny || !eligible) {
                this.removeCampaignSelection();
            }
        }
    }

    initializeCampaigns() {
        const selectBtn = document.getElementById("menuCampaignSelectBtn");
        const modal = document.getElementById("campaignModal");
        const modalClose = document.getElementById("campaignModalClose");
        if (selectBtn && !selectBtn.hasAttribute("data-campaign-initialized")) {
            selectBtn.setAttribute("data-campaign-initialized", "true");
            selectBtn.addEventListener("click", () =>
                this.openCampaignModalForMenu(),
            );
        }
        // Kampanya kaldır: event delegation (sepet modal içindeki buton her render'da aynı kalabilir ama tek listener)
        if (!document.body.hasAttribute("data-menu-campaign-remove-bound")) {
            document.body.setAttribute("data-menu-campaign-remove-bound", "true");
            document.body.addEventListener("click", (e) => {
                const btn = e.target.closest("#menuCampaignRemoveBtn");
                if (btn && typeof this.removeCampaignSelection === "function") this.removeCampaignSelection();
            });
        }
        if (modalClose) {
            modalClose.addEventListener(
                "click",
                () => modal && modal.classList.remove("active"),
            );
        }
        if (modal) {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) modal.classList.remove("active");
            });
        }
        this.updateCampaignSelectVisibility();
    }

    initializePromoCode() {
        const promoInput = document.getElementById("promoCodeInput");
        const applyBtn = document.getElementById("applyPromoBtn");
        const errorMessage = document.getElementById("promoErrorMessage");

        if (!promoInput || !applyBtn) return;

        // Prevent duplicate event listeners
        if (promoInput.hasAttribute("data-promo-initialized")) return;
        promoInput.setAttribute("data-promo-initialized", "true");

        // Show/hide apply button based on input value
        promoInput.addEventListener("input", (e) => {
            const value = e.target.value.trim();
            if (value.length > 0) {
                applyBtn.style.display = "block";
                if (errorMessage) errorMessage.style.display = "none";
            } else {
                applyBtn.style.display = "none";
                if (errorMessage) errorMessage.style.display = "none";
            }
        });

        // Apply promo code on button click
        applyBtn.addEventListener("click", () => {
            this.applyPromoCode();
        });

        // Apply promo code on Enter key
        promoInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && promoInput.value.trim().length > 0) {
                this.applyPromoCode();
            }
        });

        // Remove all promos button
        const removePromoBtn = document.getElementById("removePromoBtn");
        if (removePromoBtn) {
            removePromoBtn.addEventListener("click", () => {
                this.removePromoCode();
            });
        }

        // Tek tek promo silmek için chip alanında event delegation
        const promoAppliedCode = document.getElementById("promoAppliedCode");
        if (promoAppliedCode) {
            promoAppliedCode.addEventListener("click", (e) => {
                const btn = e.target.closest(".promo-chip-remove");
                if (!btn) return;
                const promoId = btn.getAttribute("data-promo-id");
                if (!promoId) return;
                this.removeSinglePromo(promoId);
            });
        }
    }

    removeSinglePromo(promoId) {
        if (!Array.isArray(this.appliedPromos) || this.appliedPromos.length === 0)
            return;
        const idNum = isNaN(Number(promoId)) ? null : Number(promoId);
        this.appliedPromos = this.appliedPromos.filter((p) => {
            if (p.id != null && idNum != null) {
                return Number(p.id) !== idNum;
            }
            // id yoksa koda göre eşle
            return String(p.code) !== String(promoId);
        });
        this.savePromo();
        // Sepet görünümünü ve toplamları yenile
        this.renderNewCartModal();
    }

    removePromoCode() {
        this.appliedPromos = [];
        this.savePromo(); // Remove from localStorage

        // Reset UI
        const promoRow = document.querySelector(".promo-row");
        const promoInput = document.getElementById("promoCodeInput");
        const applyBtn = document.getElementById("applyPromoBtn");
        const errorMessage = document.getElementById("promoErrorMessage");
        const promoAppliedRow = document.getElementById("promoAppliedRow");

        // Promo satırını sıfırla
        if (promoRow) promoRow.style.display = "flex";
        if (promoInput) {
            promoInput.value = "";
            promoInput.disabled = false;
            promoInput.style.backgroundColor = "#FAF8F2";
        }
        if (applyBtn) applyBtn.style.display = "none";
        if (errorMessage) errorMessage.style.display = "none";
        if (promoAppliedRow) promoAppliedRow.style.display = "none";

        // Refresh cart totals
        this.renderNewCartModal();

        // Kupon politikası varsa tekrar uygula
        this.applyCouponPolicyToMenuInput();
    }

    async applyPromoCode() {
        if (isTahmisciBackendCatalogMode()) return;
        const promoInput = document.getElementById("promoCodeInput");
        const applyBtn = document.getElementById("applyPromoBtn");
        const errorMessage = document.getElementById("promoErrorMessage");

        if (!promoInput || !applyBtn || !errorMessage) return;

        // Get translations
        const translations = window.I18N?.getTranslations?.();
        const lang = window.I18N?.getPreferredLanguage?.() || "tr";
        const t = (key, fallback) =>
            translations?.[lang]?.[key] !== undefined
                ? translations[lang][key]
                : fallback;

        // Prevent multiple simultaneous requests
        const checkingText = t("promo_checking", "Kontrol ediliyor...");
        if (applyBtn.disabled || applyBtn.textContent === checkingText) return;

        const promoCode = promoInput.value.trim();

        // Kampanya kuponu engelliyorsa burada dur
        if (!this.couponAllowed) {
            errorMessage.textContent =
                this.couponBlockReason || "Kupon bu kampanya ile kullanılamaz";
            errorMessage.style.display = "block";
            return;
        }

        if (!promoCode) {
            errorMessage.textContent = t(
                "promo_enter_code",
                "Lütfen promosyon kodunu girin",
            );
            errorMessage.style.display = "block";
            return;
        }

        // Disable button during request
        applyBtn.disabled = true;
        applyBtn.textContent = checkingText;
        errorMessage.style.display = "none";

        try {
            // Sepet ve bağlam (genişletilmiş kupon motoru için)
            const cartItems = window.globalCart && window.globalCart.getItems ? window.globalCart.getItems() : (this.cart || []);
            const cartList = Array.isArray(cartItems) ? cartItems : [];
            const items = cartList.map((item) => ({
                productId: item.productId || item.id || 0,
                categoryId: item.categoryId || item.category_id || 0,
                quantity: Number(item.quantity) || 1,
                unitPrice: item.price != null ? item.price : (item.unitPrice != null ? item.unitPrice : 0),
                price: item.price != null ? item.price : (item.unitPrice != null ? item.unitPrice : 0),
                name: item.name || item.title || "Ürün",
            }));
            const companyId = parseInt(localStorage.getItem("menuBranchId") || localStorage.getItem("menuCompanyId") || "0", 10) || 0;
            const orderType = localStorage.getItem("menuOrderType") || "tableOrder";
            const isFirstOrder = localStorage.getItem("is_first_order") === "true";
            const visitCount = parseInt(localStorage.getItem("visit_count") || "0", 10);
            const body = {
                code: promoCode,
                lang: getAjaxLang(),
                items,
                branch_id: companyId,
                order_type: orderType,
                is_first_order: isFirstOrder,
                visit_count: visitCount,
                customer: { is_first_order: isFirstOrder, visit_count: visitCount },
            };
            const response = await fetch(getSiteRoot() + "/yeppanel/db/ajax/web/validate-promo-code.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (data.success && data.promo) {
                // Promo code is valid
                const newPromo = {
                    id: data.promo.id ?? null,
                    code: promoCode,
                    discount: data.promo.discount,
                    discount_cents: data.promo.discount_cents ?? null,
                    percent_int: data.promo.percent_int ?? null,
                    type: data.promo.type || "fixed",
                    description: data.promo.description || "",
                    min_order_cents: data.promo.min_order_cents ?? null,
                    max_discount_cents: data.promo.max_discount_cents ?? null,
                    free_items: Array.isArray(data.promo.free_items) ? data.promo.free_items : [],
                    free_shipping: data.promo.free_shipping === true,
                    points: data.promo.points ?? 0,
                    promotion_policy: data.promo.promotion_policy || null,
                };

                // Daha önce aynı ID'ye sahip promo eklenmiş mi?
                const alreadyExists = Array.isArray(this.appliedPromos)
                    ? this.appliedPromos.some((p) => p.id === newPromo.id)
                    : false;

                if (alreadyExists) {
                    // Aynı promosyon tekrar eklenemez
                    errorMessage.textContent = t(
                        "promo_already_applied",
                        "Bu promosyon kodu zaten uygulanmış.",
                    );
                    errorMessage.style.display = "block";
                } else {
                    // Listeye ekle
                    if (!Array.isArray(this.appliedPromos)) {
                        this.appliedPromos = [];
                    }
                    this.appliedPromos.push(newPromo);

                    // Save to localStorage
                    this.savePromo();

                    // Input'u temizle, bir sonraki kod için hazır bırak
                    promoInput.value = "";
                    promoInput.disabled = false;
                    promoInput.style.backgroundColor = "#FAF8F2";
                    applyBtn.style.display = "none";
                    errorMessage.style.display = "none";

                    // Refresh cart totals
                    this.renderNewCartModal();

                    // Show success message
                    if (window.Swal && typeof window.Swal.fire === "function") {
                        const successMessage = t(
                            "promo_success_message",
                            'Promosyon kodu "{code}" uygulandı! {discount} TL indirim kazandınız.',
                        )
                            .replace("{code}", promoCode)
                            .replace("{discount}", data.promo.discount);

                        await window.Swal.fire({
                            title: t("promo_success_title", "Başarılı!"),
                            text: successMessage,
                            icon: "success",
                            confirmButtonText: "Tamam",
                            confirmButtonColor: "#8C734B",
                            timer: 2000,
                            timerProgressBar: true,
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            width: "auto",
                            padding: "1rem 1.5rem",
                        });
                    }
                }
            } else {
                // Promo code is invalid
                this.appliedPromo = null;
                this.savePromo(); // Remove from localStorage
                errorMessage.textContent =
                    data.message ||
                    t(
                        "promo_not_found",
                        "Promosyon kodu bulunamadı. Lütfen farklı bir kod deneyin",
                    );
                errorMessage.style.display = "block";

                // Reset input
                promoInput.focus();
            }
        } catch (error) {
            console.error("Promo code validation error:", error);
            errorMessage.textContent = t(
                "promo_error",
                "Bir hata oluştu. Lütfen tekrar deneyin.",
            );
            errorMessage.style.display = "block";
            this.appliedPromo = null;
            this.savePromo(); // Remove from localStorage
        } finally {
            // Re-enable button
            applyBtn.disabled = false;
            applyBtn.textContent = t("promo_apply_btn", "Uygula");
        }
    }

    updateCartTotals(itemsTotal, itemsCount) {
        const itemsTotalEl = document.getElementById("cartItemsTotal");
        const itemsCountEl = document.getElementById("cartItemsCount");
        const orderTotalEl = document.getElementById("cartOrderTotal");
        const footerTotalEl = document.getElementById("newCartFooterTotal");
        const campaignAppliedRow = document.getElementById(
            "menuCampaignAppliedRow",
        );
        const campaignAppliedCode = document.getElementById(
            "menuCampaignAppliedCode",
        );
        const campaignAppliedDiscount = document.getElementById(
            "menuCampaignAppliedDiscount",
        );
        const promoAppliedRow = document.getElementById("promoAppliedRow");
        const promoAppliedCode = document.getElementById("promoAppliedCode");
        const promoAppliedDiscount = document.getElementById(
            "promoAppliedDiscount",
        );

        // Kampanya indirimi: Backend motoru tek kaynak; motor indirim döndüyse client tarafı eklenmez (çift hesaplama önlenir)
        const itemsTotalCents = this.moneyToCents(itemsTotal);
        const engineCents = typeof this.engineCampaignDiscountCents === "number" ? this.engineCampaignDiscountCents : 0;
        const useOnlyEngine = Array.isArray(this.appliedCampaigns) && this.appliedCampaigns.length > 0 && engineCents > 0;
        const legacyCampaignCents = useOnlyEngine ? 0 : ((this.selectedCampaignValidation && this.selectedCampaignValidation.eligible === false) ? 0 : this.calcCampaignDiscountCents(itemsTotalCents));
        const campaignDiscountCents = Math.min(itemsTotalCents, legacyCampaignCents + engineCents);
        const subtotalAfterCampaignCents = Math.max(
            itemsTotalCents - campaignDiscountCents,
            0,
        );

        // Birden fazla promosyonun satır bazında ve toplam indirimini hesapla
        let promoDiscountCents = 0;
        const perPromoDiscounts = [];
        if (Array.isArray(this.appliedPromos) && this.appliedPromos.length > 0) {
            this.appliedPromos.forEach((promo) => {
                const minOrderCents = Number(promo.min_order_cents || 0) || 0;
                if (minOrderCents > 0 && subtotalAfterCampaignCents < minOrderCents) return;
                const discountVal = Number(promo.discount || 0);
                const discountCentsRaw = promo.discount_cents != null ? Number(promo.discount_cents) : null;
                const percentInt = promo.percent_int != null ? Number(promo.percent_int) : null;
                let lineDiscountCents = 0;
                if (promo.type === "fixed" || promo.type === "min_order_fixed") {
                    lineDiscountCents = discountCentsRaw != null ? discountCentsRaw : this.moneyToCents(discountVal);
                } else if (promo.type === "percentage" || promo.type === "percent" || promo.type === "percentage_capped" || promo.type === "min_order_percent") {
                    const pct = percentInt != null ? percentInt : discountVal;
                    lineDiscountCents = Math.round((subtotalAfterCampaignCents * pct) / 100);
                    const maxCents = promo.max_discount_cents != null ? Number(promo.max_discount_cents) : null;
                    if (maxCents != null && lineDiscountCents > maxCents) lineDiscountCents = maxCents;
                }
                if (lineDiscountCents > 0) {
                    perPromoDiscounts.push({
                        promo,
                        amountCents: lineDiscountCents,
                    });
                    promoDiscountCents += lineDiscountCents;
                }
            });
            // Toplam indirim, ürün toplamını aşmasın
            promoDiscountCents = Math.min(
                promoDiscountCents,
                subtotalAfterCampaignCents,
            );
        }

        const finalTotalCents = Math.max(
            0,
            itemsTotalCents - campaignDiscountCents - promoDiscountCents,
        );

        // Get translations
        const translations = window.I18N?.getTranslations?.();
        const lang = window.I18N?.getPreferredLanguage?.() || "tr";
        const t = (key, fallback) =>
            translations?.[lang]?.[key] !== undefined
                ? translations[lang][key]
                : fallback;

        // Kampanya satırı (seçili kampanya veya motor kampanyaları) – indirim veya bedava ürün varsa satır + kaldır butonu göster
        const hasFreeItems = Array.isArray(this.freeItems) && this.freeItems.length > 0;
        const hasCampaign = (this.selectedCampaign || (Array.isArray(this.appliedCampaigns) && this.appliedCampaigns.length > 0)) && (campaignDiscountCents > 0 || hasFreeItems);
        if (hasCampaign && campaignAppliedRow && campaignAppliedCode && campaignAppliedDiscount) {
            campaignAppliedRow.style.display = "flex";
            let name = "";
            if (Array.isArray(this.appliedCampaigns) && this.appliedCampaigns.length > 0) {
                name = this.appliedCampaigns.map((c) => c.title || "").filter(Boolean).join(", ");
            }
            if (!name && this.selectedCampaign) name = this.selectedCampaign.title || "Kampanya";
            if (!name) name = "Kampanya indirimi";
            campaignAppliedCode.textContent = name;
            campaignAppliedDiscount.textContent = campaignDiscountCents > 0
                ? "-" + this.centsToMoneyText(campaignDiscountCents)
                : (hasFreeItems ? (t("cart_free_items", "Ücretsiz ürünler") || "Ücretsiz ürünler") : "");
        } else if (campaignAppliedRow) {
            campaignAppliedRow.style.display = "none";
        }

        // Ücretsiz ürünler satırı (kampanya motoru)
        const freeItemsRow = document.getElementById("menuFreeItemsRow");
        const freeItemsList = document.getElementById("menuFreeItemsList");
        if (Array.isArray(this.freeItems) && this.freeItems.length > 0 && freeItemsRow && freeItemsList) {
            freeItemsRow.style.display = "flex";
            freeItemsList.innerHTML = this.freeItems.map((f) => {
                const n = (f.name || "Ürün").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                const q = Number(f.quantity) || 1;
                return "<div class=\"free-item-line\"><span class=\"free-item-badge\">Ücretsiz</span> " + n + " x " + q + "</div>";
            }).join("");
        } else if (freeItemsRow) {
            freeItemsRow.style.display = "none";
        }

        // Show/hide promo applied row
        if (perPromoDiscounts.length > 0 && promoAppliedRow) {
            promoAppliedRow.style.display = "flex";
            if (promoAppliedCode) {
                // Her promosyon için ayrı satır (sol kod, sağ tutar)
                const linesHtml = perPromoDiscounts
                    .map(({ promo, amountCents }) => {
                        const desc = (promo.description || "").trim();
                        const safeId = promo.id != null ? String(promo.id) : "";
                        const label = desc
                            ? `${desc} (<small class="promo-chip-code">${promo.code}</small>)`
                            : `<small class="promo-chip-code">${promo.code}</small>`;
                        return `
              <div class="promo-line">
                <span class="promo-chip" data-promo-id="${safeId}">
                  <span>${label}</span>
                  <button type="button" class="promo-chip-remove" data-promo-id="${safeId}">&times;</button>
                </span>
                <span class="promo-line-amount">-${this.centsToMoneyText(
                            amountCents,
                        )}</span>
              </div>
            `;
                    })
                    .join("");
                promoAppliedCode.innerHTML = linesHtml;
            }
            if (promoAppliedDiscount) {
                promoAppliedDiscount.textContent = "";
            }
        } else if (promoAppliedRow) {
            promoAppliedRow.style.display = "none";
        }

        if (itemsTotalEl)
            itemsTotalEl.textContent = this.centsToMoneyText(itemsTotalCents) + "";
        if (itemsCountEl)
            itemsCountEl.textContent = `${itemsCount} ${t("cart_items_unit", "ürün")}`;
        if (orderTotalEl)
            orderTotalEl.textContent = this.centsToMoneyText(finalTotalCents) + "";
        if (footerTotalEl)
            footerTotalEl.textContent = this.centsToMoneyText(finalTotalCents) + "";
    }

    // ========== NOTIFICATION SYSTEM ==========

    showAddToCartNotification(product, quantity) {
        if (!product) {
            return;
        }

        const notification = document.getElementById("addToCartNotification");

        // Cart edit modal elements
        this.cartEditModalOverlay = document.getElementById("cartEditModalOverlay");
        this.cartEditModalClose = document.getElementById("cartEditModalClose");
        this.cartEditQuantityMinus = document.getElementById(
            "cartEditQuantityMinus",
        );
        this.cartEditQuantityPlus = document.getElementById("cartEditQuantityPlus");
        this.cartEditQuantity = document.getElementById("cartEditQuantity");
        this.cartEditUpdateBtn = document.getElementById("cartEditUpdateBtn");
        this.cartEditTotalPrice = document.getElementById("cartEditTotalPrice");

        // Check if elements exist
        if (!this.cartDrawerOverlay) {
            return;
        }

        // Event listeners
        if (this.cartDrawerClose) {
            this.cartDrawerClose.addEventListener("click", () =>
                this.closeCartDrawer(),
            );
        }

        if (this.cartContinueBtn) {
            this.cartContinueBtn.addEventListener("click", () =>
                this.closeCartDrawer(),
            );
        }

        if (this.cartCheckoutBtn) {
            this.cartCheckoutBtn.addEventListener("click", () => {
                window.location.href = "siparis";
            });
        }

        if (this.cartDrawerOverlay) {
            this.cartDrawerOverlay.addEventListener("click", (e) => {
                if (e.target === this.cartDrawerOverlay) {
                    this.closeCartDrawer();
                }
            });
        }

        // Cart edit modal event listeners
        if (this.cartEditModalClose) {
            this.cartEditModalClose.addEventListener("click", () =>
                this.closeCartEditModal(),
            );
        }

        if (this.cartEditModalOverlay) {
            this.cartEditModalOverlay.addEventListener("click", (e) => {
                if (e.target === this.cartEditModalOverlay) {
                    this.closeCartEditModal();
                }
            });
        }

        if (this.cartEditQuantityMinus) {
            this.cartEditQuantityMinus.addEventListener("click", () =>
                this.changeCartEditQuantity(-1),
            );
        }

        if (this.cartEditQuantityPlus) {
            this.cartEditQuantityPlus.addEventListener("click", () =>
                this.changeCartEditQuantity(1),
            );
        }

        if (this.cartEditUpdateBtn) {
            this.cartEditUpdateBtn.addEventListener("click", () =>
                this.updateCartItem(),
            );
        }

        // Cart button listeners
        const cartButtons = document.querySelectorAll(
            '.cart-btn, .mobile-action-btn[href*="cart"], .action-btn[href*="cart"]',
        );

        cartButtons.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                this.openCartDrawer();
            });
        });

        // Header cart button
        const headerCartBtn = document.querySelector('.action-btn[href="siparis"]');
        if (headerCartBtn) {
            headerCartBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this.openCartDrawer();
            });
        }

        // Cart edit option change listeners
        this.initializeCartEditOptionListeners();
    }

    // ========== CART EDIT MODAL SYSTEM ==========

    openCartEditModal(cartItemId) {
        // Sepet drawer'ı kapat
        this.closeCartDrawer();

        const cartItem = this.cart.find((item) => item.id === cartItemId);
        if (!cartItem) {
            return;
        }

        // Find the original product
        const product = this.products.find((p) => p.id === cartItem.productId);
        if (!product) {
            return;
        }

        this.currentCartItem = cartItem;
        this.currentCartItemId = cartItemId;
        this.currentCartEditQuantity = cartItem.quantity;
        this.baseCartEditPrice = product.basePrice;

        // Update modal content
        this.updateCartEditModalContent(product, cartItem);

        // Reset form with current options
        this.resetCartEditModalForm(cartItem);

        // Calculate initial price
        this.updateCartEditPrice();

        // Show modal
        this.cartEditModalOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    updateCartEditModalContent(product, cartItem) {
        // Update product image
        const modalImage = document.getElementById("cartEditProductImage");
        if (modalImage) {
            modalImage.src = product.image;
            modalImage.alt = product.name;
            modalImage.classList.toggle("logo-fallback-image", product.image_source === "company_logo");
        }

        // Update product name
        const modalName = document.getElementById("cartEditProductName");
        if (modalName) {
            modalName.textContent = product.name;
        }

        // Update product description
        const modalDescription = document.getElementById(
            "cartEditProductDescription",
        );
        if (modalDescription) {
            modalDescription.textContent = product.description;
        }

        // Update price
        const modalCurrentPrice = document.getElementById("cartEditCurrentPrice");
        const modalOldPrice = document.getElementById("cartEditOldPrice");
        if (modalCurrentPrice) {
            modalCurrentPrice.textContent =
                parseFloat(product.basePrice || 0).toFixed(2) + "";
        }
        if (modalOldPrice && product.oldPrice) {
            modalOldPrice.textContent =
                parseFloat(product.oldPrice || 0).toFixed(2) + "";
            modalOldPrice.style.display = "inline";
        } else if (modalOldPrice) {
            modalOldPrice.style.display = "none";
        }

        // Update badge (tükendi öncelikli)
        const modalBadge = document.getElementById("cartEditProductBadge");
        if (modalBadge) {
            if (product.product_qr_status === "2") {
                modalBadge.textContent = "Tükendi";
                modalBadge.style.display = "block";
            } else if (product.badge) {
                modalBadge.textContent = this.getBadgeText(product.badge);
                modalBadge.style.display = "block";
            } else {
                modalBadge.style.display = "none";
            }
        }

        // Update size options
        this.updateCartEditSizeOptions(product.sizeOptions);

        // Update extra options
        this.updateCartEditExtraOptions(product.extraOptions);
    }

    updateCartEditSizeOptions(sizeOptions) {
        const sizeOptionsContainer = document.getElementById("cartEditSizeOptions");
        if (!sizeOptionsContainer) return;

        sizeOptionsContainer.innerHTML = "";

        sizeOptions.forEach((option, index) => {
            const label = document.createElement("label");
            label.className = "option-choice";
            label.innerHTML = `
                <input type="radio" name="cartEditSize" value="${option.name.toLowerCase()}" data-price="${option.price
                }" ${index === 1 ? "checked" : ""}>
                <div class="choice-content">
                    <span class="choice-name">${option.name}</span>
                    <span class="choice-price">+${parseFloat(option.price || 0).toFixed(2)}</span>
                </div>
            `;
            sizeOptionsContainer.appendChild(label);
        });
    }

    updateCartEditExtraOptions(extraOptions) {
        const extraOptionsContainer = document.getElementById(
            "cartEditExtraOptions",
        );
        if (!extraOptionsContainer) return;

        extraOptionsContainer.innerHTML = "";

        extraOptions.forEach((option) => {
            const label = document.createElement("label");
            label.className = "option-choice";
            label.innerHTML = `
                <input type="checkbox" name="cartEditExtra" value="${option.name.toLowerCase()}" data-price="${option.price
                }">
                <div class="choice-content">
                    <span class="choice-name">${option.name}</span>
                    <span class="choice-price">+${parseFloat(option.price || 0).toFixed(2)}</span>
                </div>
            `;
            extraOptionsContainer.appendChild(label);
        });
    }

    resetCartEditModalForm(cartItem) {
        // Set quantity
        if (this.cartEditQuantity) {
            this.cartEditQuantity.textContent = cartItem.quantity;
        }

        // Set size option
        if (
            cartItem.options &&
            cartItem.options.size &&
            cartItem.options.size.name
        ) {
            const sizeInput = document.querySelector(
                `input[name="cartEditSize"][value="${cartItem.options.size.name.toLowerCase()}"]`,
            );
            if (sizeInput) {
                sizeInput.checked = true;
            }
        }

        // Set extra options
        if (
            cartItem.options &&
            cartItem.options.extras &&
            Array.isArray(cartItem.options.extras)
        ) {
            cartItem.options.extras.forEach((extra) => {
                if (extra && extra.name) {
                    const extraInput = document.querySelector(
                        `input[name="cartEditExtra"][value="${extra.name.toLowerCase()}"]`,
                    );
                    if (extraInput) {
                        extraInput.checked = true;
                    }
                }
            });
        }

        // Set notes
        const notesTextarea = document.getElementById("cartEditProductNotes");
        if (notesTextarea && cartItem.options && cartItem.options.notes) {
            notesTextarea.value = cartItem.options.notes;
        }
    }

    changeCartEditQuantity(change) {
        const newQuantity = this.currentCartEditQuantity + change;
        if (newQuantity >= 1 && newQuantity <= 10) {
            this.currentCartEditQuantity = newQuantity;
            if (this.cartEditQuantity) {
                this.cartEditQuantity.textContent = newQuantity;
            }
            this.updateCartEditPrice();
        }
    }

    updateCartEditPrice() {
        let totalPrice = this.baseCartEditPrice;

        // Add size price
        const selectedSize = document.querySelector(
            'input[name="cartEditSize"]:checked',
        );
        if (selectedSize) {
            totalPrice += parseInt(selectedSize.dataset.price) || 0;
        }

        // Add extra prices
        const selectedExtras = document.querySelectorAll(
            'input[name="cartEditExtra"]:checked',
        );
        selectedExtras.forEach((extra) => {
            totalPrice += parseInt(extra.dataset.price) || 0;
        });

        // Multiply by quantity
        totalPrice *= this.currentCartEditQuantity;

        // Update display
        if (this.cartEditTotalPrice) {
            this.cartEditTotalPrice.textContent = totalPrice.toFixed(2) + "";
        }
    }

    updateCartItem() {
        if (!this.currentCartItem || !this.currentCartItemId) {
            return;
        }
        // Get selected options
        const selectedSize = document.querySelector(
            'input[name="cartEditSize"]:checked',
        );
        const selectedExtras = document.querySelectorAll(
            'input[name="cartEditExtra"]:checked',
        );
        const notes = document.getElementById("cartEditProductNotes");
        // Calculate total price
        let totalPrice = this.baseCartEditPrice;
        const options = {
            size: selectedSize ? selectedSize.value : null,
            extras: Array.from(selectedExtras).map((extra) => extra.value),
            notes: notes ? notes.value : "",
        };
        if (selectedSize) {
            totalPrice += parseInt(selectedSize.dataset.price) || 0;
        }
        selectedExtras.forEach((extra) => {
            const extraPrice = parseInt(extra.dataset.price) || 0;
            totalPrice += extraPrice;
        });
        // Update cart item
        const cartItem = this.cart.find(
            (item) => item.id === this.currentCartItemId,
        );
        if (cartItem) {
            cartItem.quantity = this.currentCartEditQuantity;
            cartItem.options = options;
            cartItem.price = totalPrice;
            this.saveCart();
            this.updateCartCounter();
            this.renderCartItems();
        }
        // Close modal
        this.closeCartEditModal();
        // Sepet drawer'ı tekrar aç
        this.openCartDrawer();
    }

    closeCartEditModal() {
        if (this.cartEditModalOverlay) {
            this.cartEditModalOverlay.classList.remove("active");
        }
        document.body.style.overflow = "";
        this.currentCartItem = null;
        this.currentCartItemId = null;
        this.currentCartEditQuantity = 1;
        this.baseCartEditPrice = 0;
    }

    initializeCartEditOptionListeners() {
        // Size options
        document.addEventListener("change", (e) => {
            if (e.target.name === "cartEditSize") {
                this.updateCartEditPrice();
            }
        });

        // Extra options
        document.addEventListener("change", (e) => {
            if (e.target.name === "cartEditExtra") {
                this.updateCartEditPrice();
            }
        });
    }

    openCartDrawer() {
        // Use global cart manager if available
        if (window.globalCart) {
            window.globalCart.openCartDrawer();
            if (window.updateFixedCartBtnVisibility)
                window.updateFixedCartBtnVisibility();
            // Sepet butonunu gizle
            hideCartButtons();
            // Modal açıldıktan sonra scroll listener'ı ekle
            setTimeout(() => {
                setupCartScrollControl();
            }, 100);
            return;
        }

        // Fallback to local cart drawer
        if (!this.cartDrawerOverlay) {
            return;
        }

        this.renderCartItems();
        this.cartDrawerOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
        if (window.updateFixedCartBtnVisibility)
            window.updateFixedCartBtnVisibility();

        // Sepet butonunu gizle
        hideCartButtons();

        // Modal açıldıktan sonra scroll listener'ı ekle
        setTimeout(() => {
            setupCartScrollControl();
        }, 100);
    }

    closeCartDrawer() {
        if (window.globalCart) {
            window.globalCart.closeCartDrawer();
            if (window.updateFixedCartBtnVisibility)
                window.updateFixedCartBtnVisibility();
            // Sepet butonunu göster
            showCartButtons();
            return;
        }
        if (this.cartDrawerOverlay) {
            this.cartDrawerOverlay.classList.remove("active");
        }
        // Sadece başka modal yoksa scroll'u aç
        const productModal = document.querySelector(".product-modal-overlay");
        if (!productModal || !productModal.classList.contains("active")) {
            document.body.style.overflow = "";
        }
        if (window.updateFixedCartBtnVisibility)
            window.updateFixedCartBtnVisibility();

        // Sepet butonunu göster
        showCartButtons();
    }

    renderCartItems() {
        // Use global cart manager if available
        if (window.globalCart) {
            window.globalCart.renderCartItems();
            return;
        }
        // Fallback to local cart rendering
        const cartItemsContainer = document.getElementById("cartDrawerItems");
        const cartEmpty = document.getElementById("cartEmpty");
        const cartFooter = document.getElementById("cartDrawerFooter");
        const cartTotalAmount = document.getElementById("cartTotalAmount");
        if (!cartItemsContainer) {
            return;
        }
        if (this.cart.length === 0) {
            if (cartEmpty) cartEmpty.style.display = "block";
            if (cartFooter) cartFooter.style.display = "none";
            return;
        }
        if (cartEmpty) cartEmpty.style.display = "none";
        if (cartFooter) cartFooter.style.display = "block";
        // Render cart items
        cartItemsContainer.innerHTML = "";
        this.cart.forEach((item) => {
            // Ensure options structure exists
            if (!item.options) {
                item.options = { size: null, extras: [], notes: "" };
            }
            if (!item.options.extras) {
                item.options.extras = [];
            }
            // Boyut (size) stringleştirme
            let sizeText = "";
            if (item.options.size) {
                if (
                    typeof item.options.size === "object" &&
                    item.options.size !== null
                ) {
                    sizeText = `<span class="cart-option">Boyut: ${item.options.size.name || ""
                        }</span>`;
                } else {
                    sizeText = `<span class="cart-option">Boyut: ${item.options.size}</span>`;
                }
            }
            // Ekstralar (extras) stringleştirme
            let extrasArr = [];
            if (Array.isArray(item.options.extras)) {
                extrasArr = item.options.extras
                    .filter((e) => e && e !== "null" && e !== "")
                    .map((e) => (typeof e === "object" && e !== null ? e.name || "" : e))
                    .filter((e) => e);
            }
            const extrasText =
                extrasArr.length > 0
                    ? `<span class="cart-option">Ekstra: ${extrasArr.join(", ")}</span>`
                    : "";
            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <div class="cart-item-options">
                        ${sizeText}
                        ${extrasText}
                    </div>
                    <div class="cart-item-price">${parseFloat(item.price || 0).toFixed(2)}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" onclick="window.menuPage.updateCartQuantity('${item.id
                }', ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="window.menuPage.updateCartQuantity('${item.id
                }', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-buttons">
                        <button class="edit-item-btn" onclick="window.menuPage.openCartEditModal('${item.id
                }')" title="Düzenle">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="remove-item-btn" onclick="window.menuPage.removeFromCart('${item.id
                }')" title="Sil">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        // Update total
        if (cartTotalAmount) {
            cartTotalAmount.textContent = this.getCartTotal().toFixed(2) + "";
        }
    }

    // ========== NOTIFICATION SYSTEM ==========

    showAddToCartNotification(product, quantity) {
        if (!product) {
            return;
        }

        const titleText = "Ürün sepete eklendi!";
        const descText = `${product.name}${quantity > 1 ? ` (${quantity} adet)` : ""} sepetinize eklendi`;

        if (window.Swal && typeof window.Swal.fire === "function") {
            window.Swal.fire({
                icon: "success",
                title: titleText,
                text: descText,
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
                width: "auto",
                padding: "1rem 1.5rem",
            });
        }

        this.updateCartCounter();
        setTimeout(() => {
            this.openCartDrawer();
        }, 1000);
    }

    // ========== FAVORITES SYSTEM ==========

    initializeFavorites() {
        this.favorites = this.loadFavorites();
        this.updateFavoriteButtons();
    }

    toggleFavorite(productId) {
        const index = this.favorites.indexOf(productId);

        if (index === -1) {
            this.favorites.push(productId);
        } else {
            this.favorites.splice(index, 1);
        }

        this.saveFavorites();
        this.updateFavoriteButtons();
    }

    updateFavoriteButtons() {
        const favoriteButtons = document.querySelectorAll(".product-favorite");

        favoriteButtons.forEach((btn) => {
            const productId = parseInt(btn.dataset.id);
            const isFavorite = this.favorites.includes(productId);

            if (isFavorite) {
                btn.classList.add("active");
                btn.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                btn.classList.remove("active");
                btn.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
    }

    saveFavorites() {
        try {
            localStorage.setItem("yeppos_favorites", JSON.stringify(this.favorites));
        } catch (e) {
            // Favorites save error
        }
    }

    loadFavorites() {
        try {
            const savedFavorites = localStorage.getItem("yeppos_favorites");
            return savedFavorites ? JSON.parse(savedFavorites) : [];
        } catch (e) {
            return [];
        }
    }

    // ========== MOBİL TARAYICI CHROME DETECTION ==========

    initializeViewportDetection() {
        // Store initial viewport height
        this.initialViewportHeight = window.visualViewport
            ? window.visualViewport.height
            : window.innerHeight;
        this.lastViewportHeight = this.initialViewportHeight;
        this.viewportChangeThreshold = 50; // 50px değişim eşiği
        this.isChromeVisible = false;

        // Setup event listeners
        this.setupViewportEventListeners();

        // Start periodic check
        this.startViewportPolling();
    }

    setupViewportEventListeners() {
        // Visual Viewport API (modern browsers)
        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", () => {
                this.handleViewportChange();
            });
        }

        // Window resize events
        window.addEventListener("resize", () => {
            this.handleViewportChange();
        });

        // Orientation change
        window.addEventListener("orientationchange", () => {
            setTimeout(() => {
                this.handleViewportChange();
            }, 100);
        });
    }

    startViewportPolling() {
        // Poll viewport height every 100ms to catch browser chrome changes
        this.viewportPollInterval = setInterval(() => {
            const currentHeight = window.visualViewport
                ? window.visualViewport.height
                : window.innerHeight;

            if (
                Math.abs(currentHeight - this.lastViewportHeight) >
                this.viewportChangeThreshold
            ) {
                this.handleViewportChange();
            }

            this.lastViewportHeight = currentHeight;
        }, 100);
    }

    handleViewportChange() {
        const currentHeight = window.visualViewport
            ? window.visualViewport.height
            : window.innerHeight;
        const heightDifference = this.initialViewportHeight - currentHeight;

        // Detect if browser chrome is visible (significant height reduction)
        const chromeVisible = heightDifference > this.viewportChangeThreshold;

        if (chromeVisible !== this.isChromeVisible) {
            this.isChromeVisible = chromeVisible;
            this.adjustAddToCartButton(chromeVisible, heightDifference);
        }
    }

    adjustAddToCartButton(chromeVisible, chromeHeight) {
        const addToCartRow = document.querySelector(".add-to-cart-row");
        if (!addToCartRow) return;

        if (chromeVisible) {
            // Browser chrome is visible, move button up
            addToCartRow.style.bottom = `${chromeHeight}px`;
        } else {
            // Browser chrome is hidden, reset to bottom
            addToCartRow.style.bottom = "0px";
        }
    }

    cleanupViewportDetection() {
        // Remove event listeners
        if (window.visualViewport) {
            window.visualViewport.removeEventListener(
                "resize",
                this.handleViewportChange,
            );
        }
        window.removeEventListener("resize", this.handleViewportChange);
        window.removeEventListener("orientationchange", this.handleViewportChange);

        // Clear polling interval
        if (this.viewportPollInterval) {
            clearInterval(this.viewportPollInterval);
            this.viewportPollInterval = null;
        }

        // Reset button position
        const addToCartRow = document.querySelector(".add-to-cart-row");
        if (addToCartRow) {
            addToCartRow.style.bottom = "0px";
        }
    }
}

// ========== GLOBAL FUNCTIONS ==========

// Make functions available globally
window.openProductModal = function (productId, cartItemId = null) {
    if (!window.menuPage || !productId) {
        return;
    }

    window.menuPage.openProductModal(productId, cartItemId);

    // Galeri sistemini başlat
    setTimeout(() => {
        const products = window.MenuProducts || [];
        const product = products.find((p) => p.id == productId);

        if (product) {
            // Eğer media array varsa kullan, yoksa product.image'dan tek resimli galeri oluştur
            if (
                product.media &&
                Array.isArray(product.media) &&
                product.media.length > 0
            ) {
                const mediaWithSource = product.media.map((m) => ({
                    ...m,
                    isLogoFallback: !!(product.image_source === "company_logo" && m.type === "image" && m.url === product.image),
                }));
                window.initProductGallery(mediaWithSource);
            } else if (product.image) {
                // Fallback: Tek resimli galeri oluştur
                window.initProductGallery([{
                    type: "image",
                    url: product.image,
                    isLogoFallback: product.image_source === "company_logo",
                }]);
            }
        }
    }, 100);
};

window.toggleFavorite = function (productId, btn) {
    if (!window.menuPage || !productId) {
        return;
    }

    window.menuPage.toggleFavorite(productId);
};

ModernMenuPage.prototype.renderTahmisciRecipeSummary = function (product) {
    const modalDescription = document.getElementById("modalProductDescription");
    if (!modalDescription) return;

    let panel = document.getElementById("tahmisciRecipeSummary");
    if (!panel) {
        panel = document.createElement("div");
        panel.id = "tahmisciRecipeSummary";
        panel.className = "tahmisci-recipe-summary";
        modalDescription.insertAdjacentElement("afterend", panel);
    }

    const isValidInfo = (value) => {
        const text = String(value ?? "").trim();
        if (!text) return false;
        const normalized = text.toLocaleLowerCase("tr-TR");
        return !["0", "n/a", "undefined", "null", "kaynakta tanimli degil"].includes(normalized);
    };
    const nutritionData = this.getProductNutrition(product || {});
    const details = nutritionData.details || [];
    const findDetail = (needle) => details.find((item) => {
        const key = String(item.name || "").toLocaleLowerCase("tr-TR");
        return key.includes(needle);
    });

    const contentItem = findDetail("recete") || findDetail("reçete") || findDetail("icerik") || findDetail("içerik");
    const allergenItem = findDetail("alerjen");
    const content = contentItem
        ? this.formatNutritionDisplayValue(contentItem.value, contentItem.unit)
        : (product?.description || "");
    const allergens = allergenItem
        ? this.formatNutritionDisplayValue(allergenItem.value, allergenItem.unit)
        : "";
    const calories = nutritionData.hasCalories
        ? this.formatNutritionDisplayValue(nutritionData.calories, nutritionData.caloriesUnit || "kcal")
        : "";

    const rows = [
        { label: "İçerik", value: content },
        { label: "Kalori", value: calories },
        { label: "Alerjen", value: allergens }
    ].filter((row) => isValidInfo(row.value));

    panel.innerHTML = rows.map((row) => `
        <div class="tahmisci-recipe-summary-row">
            <strong>${this.escapeHtml(row.label)}</strong>
            <span>${this.escapeHtml(row.value)}</span>
        </div>
    `).join("");
    panel.style.display = rows.length ? "grid" : "none";
};

// ========== INITIALIZE ON PAGE LOAD ==========

document.addEventListener("DOMContentLoaded", function () {
    // Initialize menu page
    window.menuPage = new ModernMenuPage();

    document.addEventListener("categoriesLoaded", () => {
        if (window.menuPage) {
            window.menuPage.initializeFilters();
            window.menuPage.initializeScrollBasedCategoryActivation();
        }
    });

    document.addEventListener("productsRendered", () => {
        if (window.menuPage) {
            window.menuPage.initializeFilters();
            window.menuPage.initializeScrollBasedCategoryActivation();
            if (window.pendingScrollToCategoryId != null) {
                window.menuPage.scrollToCategory(window.pendingScrollToCategoryId);
                window.pendingScrollToCategoryId = null;
            }
        }
    });

    // Menü DOM'da gerçekten body'nin sonunda mı? Değilse taşı
    const globalMenu = document.getElementById("moreCategoriesMenuGlobal");
    if (globalMenu && globalMenu.parentNode !== document.body) {
        document.body.appendChild(globalMenu);
    }

    // Add cart item CSS styles
    const cartItemStyles = `
        <style>
        .cart-item {
            display: flex;
            align-items: center;
            padding: 1rem;
            border-bottom: 1px solid #F4F0E7;
            gap: 1rem;
        }
        
        .cart-item-image {
            width: 60px;
            height: 60px;
            border-radius: 8px;
            overflow: hidden;
            flex-shrink: 0;
        }
        
        .cart-item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .cart-item-details {
            flex: 1;
        }
        
        .cart-item-name {
            font-size: 0.9rem;
            font-weight: 600;
            color: #2B2A28;
            margin: 0 0 0.25rem 0;
        }
        
        .cart-item-options {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            margin-bottom: 0.5rem;
        }
        
        .cart-option {
            font-size: 0.75rem;
            color: #8C734B;
        }
        
        .cart-item-price {
            font-weight: 600;
            color: #8C734B;
            font-size: 0.9rem;
        }
        
        .cart-item-actions {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
        }
        
        .cart-item-quantity {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .cart-item-quantity .quantity-btn {
            width: 28px;
            height: 28px;
            border: 1px solid #F4F0E7;
            background: white;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 0.75rem;
        }
        
        .cart-item-quantity .quantity-display {
            font-size: 0.9rem;
            font-weight: 600;
            min-width: 20px;
            text-align: center;
        }
        
        .remove-item-btn {
            background: none;
            border: none;
            color: #8C734B;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            background: antiquewhite;
        }
        
        .remove-item-btn:hover {
            background: rgba(140, 115, 75, 0.1);
        }
        </style>
    `;

    document.head.insertAdjacentHTML("beforeend", cartItemStyles);

    // === Sticky Filter Bar ve Smooth Scroll ===
    const filterBar = document.getElementById("stickyFilterBar");
    const filterBtns = filterBar ? filterBar.querySelectorAll(".filter-btn") : [];
    let productGrid = document.getElementById("productsGrid");
    let productCards = productGrid
        ? productGrid.querySelectorAll(".product-card")
        : [];

    function refreshProductCards() {
        productGrid = document.getElementById("productsGrid");
        productCards = productGrid
            ? productGrid.querySelectorAll(".product-card")
            : [];
    }

    // Kategoriye göre ürünleri göster/gizle
    function filterProducts(category) {
        if (!productCards || productCards.length === 0) {
            refreshProductCards();
        }
        const categoryMatches = (card) =>
            category === "all" ||
            card.dataset.category === category ||
            card.dataset.parentCategory === category;
        productCards.forEach((card) => {
            if (categoryMatches(card)) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    }

    // Filtre butonuna tıklayınca
    filterBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            filterBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            const category = btn.dataset.category;
            filterProducts(category);
            // İlk görünen ürüne smooth scroll
            if (category === "all") {
                window.scrollTo({
                    top: filterBar.offsetTop + filterBar.offsetHeight,
                    behavior: "smooth",
                });
            } else {
                const firstCard = Array.from(productCards).find(
                    (card) =>
                        card.dataset.category === category ||
                        card.dataset.parentCategory === category,
                );
                if (firstCard) {
                    const y =
                        firstCard.getBoundingClientRect().top +
                        window.scrollY -
                        filterBar.offsetHeight -
                        12;
                    window.scrollTo({ top: y, behavior: "smooth" });
                }
            }
        });
    });

    // Sticky bar için (mobilde de çalışır)
    let lastScrollY = window.scrollY;
    let scrollTimeout;
    function updateActiveCategoryOnScroll() {
        if (!productCards || productCards.length === 0) {
            refreshProductCards();
            if (!productCards || productCards.length === 0) {
                return;
            }
        }
        // Sticky bar zaten CSS ile sticky, burada aktif kategori vurgusu için scroll takibi yapılabilir.
        // Eğer sticky bar üstte ise, aktif kategori güncellenebilir.
        let currentCategory = "all";
        let minDist = Infinity;
        const headerHeight = document.querySelector(".header")?.offsetHeight || 0;
        const filterHeight =
            document.querySelector(".menu-filters-section")?.offsetHeight || 0;
        const offset = headerHeight + filterHeight + 20;

        productCards.forEach((card) => {
            if (card.style.display !== "none") {
                const cardRect = card.getBoundingClientRect();
                const dist = Math.abs(cardRect.top - offset);
                if (dist < minDist) {
                    minDist = dist;
                    currentCategory = card.dataset.category;
                }
            }
        });

        // Aktif kategoriyi güncelle
        filterBtns.forEach((btn) => {
            btn.classList.toggle(
                "active",
                btn.dataset.category === currentCategory ||
                (currentCategory === "all" && btn.dataset.category === "all"),
            );
        });

        // Aktif kategoriyi görünür hale getir (mobilde)
        if (filterBar && window.innerWidth <= 768) {
            const activeButton = document.querySelector(
                `.filter-btn[data-category="${currentCategory}"]`,
            );
            if (activeButton) {
                const containerRect = filterBar.getBoundingClientRect();
                const buttonRect = activeButton.getBoundingClientRect();

                // Eğer buton container'ın dışındaysa scroll et
                if (
                    buttonRect.left < containerRect.left ||
                    buttonRect.right > containerRect.right
                ) {
                    const scrollLeft =
                        activeButton.offsetLeft -
                        containerRect.width / 2 +
                        buttonRect.width / 2;
                    filterBar.scrollTo({
                        left: scrollLeft,
                        behavior: "smooth",
                    });
                }
            }
        }

        lastScrollY = window.scrollY;
    }

    window.addEventListener("scroll", function () {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateActiveCategoryOnScroll();
        }, 50); // 50ms debounce
    });

    document.addEventListener("productsRendered", () => {
        refreshProductCards();
        updateActiveCategoryOnScroll();
    });

    // Mobilde yatay scroll için swipe desteği (opsiyonel)
    if (filterBar) {
        let isDown = false,
            startX,
            scrollLeft;
        filterBar.addEventListener("mousedown", (e) => {
            isDown = true;
            filterBar.classList.add("dragging");
            startX = e.pageX - filterBar.offsetLeft;
            scrollLeft = filterBar.scrollLeft;
        });
        filterBar.addEventListener("mouseleave", () => {
            isDown = false;
            filterBar.classList.remove("dragging");
        });
        filterBar.addEventListener("mouseup", () => {
            isDown = false;
            filterBar.classList.remove("dragging");
        });
        filterBar.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - filterBar.offsetLeft;
            const walk = (x - startX) * 1.5;
            filterBar.scrollLeft = scrollLeft - walk;
        });
    }

    // Responsive filter-btn overflow: Sığmayanları Daha'ya taşı
    function updateFilterButtonsOverflow() {
        const container = document.querySelector(".filter-categories");
        const moreBtn = document.getElementById("moreCategoriesBtn");
        const moreMenu = document.getElementById("moreCategoriesMenu");
        if (!container || !moreBtn || !moreMenu) return;

        // Tüm butonları geri ana menüye al
        const overflowBtns = Array.from(moreMenu.querySelectorAll(".filter-btn"));
        overflowBtns.forEach((btn) => container.insertBefore(btn, moreBtn));

        // Mobilde çalışsın
        if (window.innerWidth > 991) {
            moreBtn.style.display = "";
            moreMenu.innerHTML = "";
            return;
        }

        // Sığmayanları bul
        const containerRect = container.getBoundingClientRect();
        let lastRight = moreBtn.offsetLeft + moreBtn.offsetWidth;
        let foundOverflow = false;
        const btns = Array.from(
            container.querySelectorAll(".filter-btn:not(.dropdown-toggle)"),
        );
        btns.forEach((btn) => {
            const btnRect = btn.getBoundingClientRect();
            if (btnRect.right > containerRect.right - moreBtn.offsetWidth - 8) {
                moreMenu.appendChild(btn);
                foundOverflow = true;
            }
        });
        // Eğer hiç taşan yoksa Daha butonunu gizle
        moreBtn.style.display = foundOverflow ? "" : "none";
    }

    window.addEventListener("resize", updateFilterButtonsOverflow);
    document.addEventListener("DOMContentLoaded", updateFilterButtonsOverflow);

    // Ürün kartına tıklayınca modal aç (mobil ve masaüstü)
    setTimeout(function () {
        const productCards = document.querySelectorAll(
            ".product-card, .modern-product-card",
        );
        productCards.forEach((card) => {
            card.style.cursor = "pointer";
            card.addEventListener("click", function (e) {
                // Sadece kartın içindeki butonlara tıklanmadıysa modal aç
                if (e.target.closest("button, .btn, .product-favorite")) return;
                const id = card.dataset.id || card.getAttribute("data-id");
                if (id) openProductModal(parseInt(id));
            });
            // Kart içindeki butonlara tıklanınca bubbling'i engelle
            const buttons = card.querySelectorAll("button, .btn, .product-favorite");
            buttons.forEach((btn) => {
                btn.addEventListener("click", function (ev) {
                    ev.stopPropagation();
                });
            });
        });
    }, 300);
});

// ========== KEYBOARD SHORTCUTS ==========

document.addEventListener("keydown", function (e) {
    // ESC key to close modals
    if (e.key === "Escape") {
        if (window.menuPage) {
            window.menuPage.closeProductModal();
            window.menuPage.closeCartDrawer();
        }
    }
});

// Sepete ekleme fonksiyonunu düzelt: Sadece isimleri kaydet
function getSelectedOptions() {
    // Boyut
    const selectedSizeInput = document.querySelector(
        'input[name="size"]:checked',
    );
    const size = selectedSizeInput ? selectedSizeInput.value : null;
    // Ekstralar
    const selectedExtraInputs = document.querySelectorAll(
        'input[name="extra"]:checked',
    );
    const extras = Array.from(selectedExtraInputs).map((input) => input.value);
    return { size, extras };
}

// Mobil filtre slider okları
function scrollFilterCategories(direction) {
    const container = document.querySelector(".filter-categories");
    if (!container) return;
    const scrollAmount = 120;
    if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
}

function setupFilterArrows() {
    const leftArrow = document.getElementById("filterArrowLeft");
    const rightArrow = document.getElementById("filterArrowRight");
    if (leftArrow && rightArrow) {
        leftArrow.addEventListener("click", function () {
            scrollFilterCategories("left");
        });
        rightArrow.addEventListener("click", function () {
            scrollFilterCategories("right");
        });
    }
}

document.addEventListener("DOMContentLoaded", setupFilterArrows);

document.addEventListener("DOMContentLoaded", function () {
    var moreBtn = document.getElementById("moreCategoriesBtn");
    var moreMenu = document.getElementById("moreCategoriesMenu");
    var dropdown = moreBtn ? moreBtn.closest(".filter-dropdown") : null;
    if (moreBtn && dropdown) {
        moreBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            dropdown.classList.toggle("open");
        });
        document.addEventListener("click", function (e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove("open");
            }
        });
    }
});

function updateFixedCartBtnVisibility() {
    const cartDrawer = document.getElementById("cartDrawerOverlay");
    const productModal = document.querySelector(".product-modal-overlay");
    const btn = document.getElementById("fixedCartBtn");
    if (!btn) return;

    // Hide on mobile devices (max-width: 991px)
    if (window.innerWidth <= 991) {
        btn.style.setProperty("display", "none", "important");
        btn.style.setProperty("visibility", "hidden", "important");
        btn.style.setProperty("opacity", "0", "important");
        btn.style.setProperty("pointer-events", "none", "important");
        return;
    }

    const cartOpen = cartDrawer && cartDrawer.classList.contains("active");
    const modalOpen = productModal && productModal.classList.contains("active");

    if (cartOpen || modalOpen) {
        btn.style.setProperty("display", "none", "important");
        btn.style.setProperty("visibility", "hidden", "important");
        btn.style.setProperty("opacity", "0", "important");
        btn.style.setProperty("pointer-events", "none", "important");
    } else {
        btn.style.setProperty("display", "flex", "important");
        btn.style.setProperty("visibility", "visible", "important");
        btn.style.setProperty("opacity", "1", "important");
        btn.style.setProperty("pointer-events", "auto", "important");
    }
}

// Sepet drawer ve ürün modalı açılıp kapandığında kontrol et
document.addEventListener("DOMContentLoaded", function () {
    // Sabit sepet butonunu varsayılan olarak görünür yap (sadece desktop'ta)
    const btn = document.getElementById("fixedCartBtn");
    if (btn) {
        // Hide on mobile devices
        if (window.innerWidth <= 991) {
            btn.style.display = "none";
            btn.style.visibility = "hidden";
            btn.style.opacity = "0";
            btn.style.pointerEvents = "none";
        } else {
            btn.style.display = "flex";
            btn.style.visibility = "visible";
            btn.style.opacity = "1";
            btn.style.position = "fixed";
            btn.style.right = "18px";
            btn.style.bottom = "18px";
            btn.style.zIndex = "99999";
        }
        btn.style.width = "58px";
        btn.style.height = "58px";
        btn.style.background = "#8C734B";
        btn.style.color = "#FAF8F2";
        btn.style.boxShadow = "0 4px 24px rgba(46, 36, 24, 0.18)";
        btn.style.alignItems = "center";
        btn.style.justifyContent = "center";
        btn.style.fontSize = "2.1em";
        btn.style.border = "none";
        btn.style.cursor = "pointer";
    }

    updateFixedCartBtnVisibility();

    // Sepet modalı scroll kontrolü
    setupCartScrollControl();

    // Sepet drawer
    const cartDrawer = document.getElementById("cartDrawerOverlay");
    if (cartDrawer) {
        cartDrawer.addEventListener("transitionend", updateFixedCartBtnVisibility);
        cartDrawer.addEventListener("click", function () {
            setTimeout(updateFixedCartBtnVisibility, 100);
        });
    }

    // Ürün modalı
    const productModal = document.querySelector(".product-modal-overlay");
    if (productModal) {
        productModal.addEventListener(
            "transitionend",
            updateFixedCartBtnVisibility,
        );
        productModal.addEventListener("click", function () {
            setTimeout(updateFixedCartBtnVisibility, 100);
        });
        // Modal açıldığında hemen gizle
        productModal.addEventListener("DOMNodeInserted", function () {
            if (productModal.classList.contains("active")) {
                updateFixedCartBtnVisibility();
            }
        });
    }

    // Fallback: Her tıklamada da kontrol et
    document.body.addEventListener("click", function () {
        setTimeout(updateFixedCartBtnVisibility, 100);
    });
});

// Sayfa yüklendiğinde ve her etkileşimde kontrol et
["DOMContentLoaded", "click", "transitionend", "keyup"].forEach((evt) => {
    document.addEventListener(evt, updateFixedCartBtnVisibility);
});

// Global erişim için
window.updateFixedCartBtnVisibility = updateFixedCartBtnVisibility;

// YENİ: Sepet modalı scroll kontrolü
function setupCartScrollControl() {
    // Elementleri bul
    const cartContent = document.querySelector(".cart-drawer-content");
    const cartNextBtn = document.getElementById("cartNextBtn");
    const cartFeatures = document.getElementById("cartFeatures");

    // Elementler varsa scroll event'i ekle
    if (cartContent && cartNextBtn) {
        cartContent.addEventListener("scroll", function () {
            const scrollTop = cartContent.scrollTop;
            const scrollHeight = cartContent.scrollHeight;
            const clientHeight = cartContent.clientHeight;
            const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

            // %70'e gelince değiştir
            if (scrollPercentage >= 0.7) {
                cartNextBtn.innerHTML =
                    'Ödeme Adımına Git <i class="fas fa-chevron-right"></i>';
                cartNextBtn.style.background = "#8C734B";
                cartNextBtn.style.fontWeight = "700";

                if (cartFeatures) {
                    cartFeatures.style.display = "flex";
                    // Sepet bilgilerini güncelle
                    updateCartInfo();
                }
            } else {
                cartNextBtn.innerHTML = 'Sonraki <i class="fas fa-chevron-right"></i>';
                cartNextBtn.style.background = "var(--color-primary)";
                cartNextBtn.style.fontWeight = "600";

                if (cartFeatures) {
                    cartFeatures.style.display = "none";
                }
            }
        });

        // Sonraki butonuna tıklama olayı ekle
        cartNextBtn.addEventListener("click", function () {
            // Hem "Sonraki" hem de "Ödeme Adımına Git" için siparis'e yönlendir
            window.location.href = "siparis";
        });
    }
}

// Sonraki butonuna tıklama (backup listener)
const cartNextBtn = document.getElementById("cartNextBtn");
if (cartNextBtn) {
    cartNextBtn.addEventListener("click", function () {
        // siparis sayfasına yönlendir
        window.location.href = "siparis";
    });
}

// Alt toplam tutarını ve sepet bilgilerini güncelle
function updateCartBottomTotal() {
    const cartBottomTotalAmount = document.getElementById(
        "cartBottomTotalAmount",
    );
    const cartTotalAmount = document.getElementById("cartTotalAmount");

    if (cartBottomTotalAmount && cartTotalAmount) {
        cartBottomTotalAmount.textContent = cartTotalAmount.textContent;
    }

    // Sepet bilgilerini güncelle
    updateCartInfo();
}

// Sepet bilgilerini güncelle
function updateCartInfo() {
    const cartItemCount = document.getElementById("cartItemCount");

    let totalItems = 0;

    // Global cart'ı kontrol et
    if (window.globalCart) {
        if (window.globalCart.getCartItemCount) {
            totalItems = window.globalCart.getCartItemCount();
        } else if (
            window.globalCart.cart &&
            Array.isArray(window.globalCart.cart)
        ) {
            totalItems = window.globalCart.cart.reduce(
                (sum, item) => sum + (item.quantity || 1),
                0,
            );
        }
    } else if (window.menuPage && window.menuPage.getCartItemCount) {
        totalItems = window.menuPage.getCartItemCount();
    }

    // Ürün sayısını güncelle
    if (cartItemCount) {
        cartItemCount.textContent = `${totalItems} Ürün`;
    }
}

// Sepet butonlarını gizle
function hideCartButtons() {
    const cartButtons = document.querySelectorAll(".cart-btn, .fixed-cart-btn");
    cartButtons.forEach((btn) => {
        btn.style.setProperty("display", "none", "important");
    });
    // mobile-cart-btn'i gizleme, sadece drawer açıkken gizli olsun
}

// Sepet butonlarını göster
function showCartButtons() {
    const cartButtons = document.querySelectorAll(".cart-btn, .fixed-cart-btn");
    cartButtons.forEach((btn) => {
        btn.style.removeProperty("display");
    });
    // mobile-cart-btn zaten görünür, dokunma
}

// Global scope'a ekle
window.hideCartButtons = hideCartButtons;
window.showCartButtons = showCartButtons;

// Global cart update fonksiyonunu yakala
if (window.globalCart && window.globalCart.updateCartDisplay) {
    const originalUpdateCartDisplay = window.globalCart.updateCartDisplay;
    window.globalCart.updateCartDisplay = function () {
        originalUpdateCartDisplay.call(this);
        updateCartBottomTotal();
    };
}

// Cart drawer açıldığında da güncelle
if (window.globalCart && window.globalCart.renderCartItems) {
    const originalRenderCartItems = window.globalCart.renderCartItems;
    window.globalCart.renderCartItems = function () {
        originalRenderCartItems.call(this);
        updateCartBottomTotal();
    };
}

// Sayfa yüklendiğinde ilk güncellemeyi yap
setTimeout(updateCartBottomTotal, 500);

// ========== SCROLL İLE KATEGORİ BUTONU AKTİFLEŞTİRME ==========
document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".filter-btn[data-category]");
    const filterCategories = document.querySelector(".filter-categories");
    const anchors = document.querySelectorAll(".category-anchor[data-category]");
    const header = document.querySelector(".header");

    if (!filterButtons.length || !anchors.length) return;

    // IntersectionObserver ile anchorları gözlemle
    let lastActive = null;
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const category = entry.target.dataset.category;
                    if (lastActive !== category) {
                        lastActive = category;
                        filterButtons.forEach((btn) => {
                            if (btn.dataset.category === category) {
                                btn.classList.add("active");
                                // Butonu ortala
                                if (filterCategories && btn.scrollIntoView) {
                                    btn.scrollIntoView({
                                        behavior: "smooth",
                                        inline: "center",
                                        block: "nearest",
                                    });
                                }
                            } else {
                                btn.classList.remove("active");
                            }
                        });
                    }
                }
            });
        },
        {
            root: null,
            rootMargin: "-100px 0px -60% 0px", // header ve filter bar yüksekliği kadar offset
            threshold: 0.2,
        },
    );
    anchors.forEach((anchor) => observer.observe(anchor));
});

// ========== MOBİL TARAYICI CHROME DETECTION ==========

// ========== DODO PIZZA STYLE NAVIGATION ==========

// Initialize cart drawer buttons when page loads
document.addEventListener("DOMContentLoaded", function () {
    // Initialize cart drawer buttons
    const continueBtn = document.getElementById("cartContinueBtn");
    const checkoutBtn = document.getElementById("cartCheckoutBtn");

    if (continueBtn) {
        continueBtn.addEventListener("click", () => {
            // Close cart drawer
            if (window.menuPage) {
                window.menuPage.closeCartDrawer();
            }
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            // Navigate to cart page
            window.location.href = "siparis";
        });
    }

    // Initialize cart scroll control
    setupCartScrollControl();

    // Ayrıca timeout ile de çağır (delayed initialization)
    setTimeout(() => {
        setupCartScrollControl();
    }, 1000);
});

// ========== MENU ENTRY SELECTION (BRANCH + ORDER TYPE) ==========
(function () {
    const STORAGE_KEYS = {
        branchId: "menuBranchId",
        orderType: "menuOrderType",
        tableId: "menuTableId",
        branchSelectionType: "menuBranchSelectionType", // "qr" veya "manual"
    };

    function getParams() {
        return new URLSearchParams(window.location.search);
    }

    function getOrderTypeFromParams(params) {
        const type = params.get("type");
        if (
            type === "tableMenu" ||
            type === "tableOrder" ||
            type === "takeaway" ||
            type === "delivery"
        ) {
            return type;
        }
        if (type === "table") {
            return params.get("table") ? "tableOrder" : "tableMenu";
        }
        if (params.get("g") === "1") return "takeaway";
        if (params.get("w") === "1") return "delivery";
        if (params.get("table")) return "tableOrder";
        // Eğer sadece company_id varsa ve başka parametre yoksa tableMenu döndür
        if (
            params.get("company_id") &&
            !type &&
            params.get("g") !== "1" &&
            params.get("w") !== "1"
        ) {
            return "tableMenu";
        }
        return null;
    }

    function getTableFromParams(params) {
        return params.get("table") || params.get("t") || null;
    }

    // Menü sayfasında URL'deki company_id / type'ı hemen işle; ürünler yüklensin (dispatch sonraki tick'te ki dinleyiciler hazır olsun)
    (function applyUrlParamsSync() {
        var path = window.location.pathname || '';
        if (path.indexOf('menuler') === -1) return;
        var params = getParams();
        var urlBranchId = params.get('company_id');
        var urlOrderType = getOrderTypeFromParams(params);
        if (urlBranchId) {
            localStorage.setItem(STORAGE_KEYS.branchId, urlBranchId);
            localStorage.setItem(STORAGE_KEYS.branchSelectionType, 'qr');
        }
        if (urlOrderType) {
            localStorage.setItem(STORAGE_KEYS.orderType, urlOrderType);
        }
        if (urlBranchId || urlOrderType) {
            var branchId = localStorage.getItem(STORAGE_KEYS.branchId);
            var orderType = localStorage.getItem(STORAGE_KEYS.orderType) || 'tableMenu';
            var ev = new CustomEvent('menuSelectionChanged', {
                detail: { branchId: branchId, orderType: orderType, tableId: null }
            });
            setTimeout(function () {
                document.dispatchEvent(ev);
            }, 0);
        }
    })();

    function setBodyLock(locked) {
        document.body.style.overflow = locked ? "hidden" : "";
    }

    function openModal(modal) {
        if (!modal) return;
        modal.classList.add("active");
        setBodyLock(true);

        // Şube seçim modalı açıldığında listeyi yeniden render et
        if (modal.id === "branchSelectModal") {
            renderBranches();
        }

        // Masa seçim modalı açıldığında close butonunu kontrol et
        if (modal.id === "tableSelectModal" && tableSelectModalClose) {
            const storedTableId = localStorage.getItem(STORAGE_KEYS.tableId);
            tableSelectModalClose.style.display = storedTableId ? "flex" : "none";
        }
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove("active");
        if (
            !document.querySelector(".selection-modal-overlay.active") &&
            !document.querySelector(".auth-modal-overlay.active") &&
            !document.querySelector(".product-modal-overlay.active")
        ) {
            setBodyLock(false);
        }
    }

    async function initSelectionFlow(data) {
        if (window.TahmisciCatalog) return;
        const app = data?.app || {};
        const branches = Array.isArray(app.branches) ? app.branches : [];
        const orderTypeLabels = app.orderTypeLabels || {};
        const tablesEndpoint = app.tablesEndpoint || "";
        const isMultiBranch = app.isMultiBranch && branches.length > 1;
        const defaultBranchId = app.defaultBranchId || branches[0]?.id || null;

        const branchModal = document.getElementById("branchSelectModal");
        const orderModal = document.getElementById("orderTypeModal");
        const tableModal = document.getElementById("tableSelectModal");
        const branchList = document.getElementById("branchList");
        const orderTypeList = document.getElementById("orderTypeList");
        const orderTypeBackBtn = document.getElementById("orderTypeBackBtn");
        const tableList = document.getElementById("tableList");
        const tableBackBtn = document.getElementById("tableBackBtn");
        const tableSelectModalClose = document.getElementById(
            "tableSelectModalClose",
        );
        const tableSearchInput = document.getElementById("tableSearchInput");
        const tableSearchClear = document.getElementById("tableSearchClear");
        const branchSearchInput = document.getElementById("branchSearchInput");
        const branchSearchClear = document.getElementById("branchSearchClear");
        const branchSearchWrap = document.getElementById("branchSearchWrap");
        const selectionStatusBtn = document.getElementById("selectionStatusBtn");
        const selectionStatusText = selectionStatusBtn?.querySelector(
            ".selection-status-text",
        );
        const qrScanBtn = document.getElementById("qrScanBtn");
        const qrScanModal = document.getElementById("qrScanModal");
        const qrScanReader = document.getElementById("qrScanReader");
        const qrScanStatus = document.getElementById("qrScanStatus");
        const qrScanCloseBtn = document.getElementById("qrScanCloseBtn");

        if (
            !branchModal ||
            !orderModal ||
            !tableModal ||
            !branchList ||
            !orderTypeList ||
            !tableList
        ) {
            return;
        }

        const params = getParams();
        const urlBranchId = params.get("company_id");
        const urlOrderType = getOrderTypeFromParams(params);
        const urlTableId = getTableFromParams(params);
        const urlToken = params.get("token");

        // URL parametrelerini localStorage'e kaydet
        if (urlBranchId) {
            localStorage.setItem(STORAGE_KEYS.branchId, urlBranchId);
            // QR ile geldiğini işaretle
            localStorage.setItem(STORAGE_KEYS.branchSelectionType, "qr");
        }
        if (urlOrderType) {
            localStorage.setItem(STORAGE_KEYS.orderType, urlOrderType);
            if (urlOrderType === "tableOrder" || urlOrderType === "tableMenu") {
                try { localStorage.removeItem("guestOrder"); } catch (e) { }
                try { localStorage.removeItem("yeppos_guest_order_contact"); } catch (e) { }
                try { localStorage.removeItem("yeppos_guest_delivery_address"); } catch (e) { }
            }
        }

        const isReservationPage =
            document.body?.classList.contains("reservation-page") ||
            /(?:^|\/)(rezervasyon|reservation)(?:\.php)?\/?$/i.test(
                window.location.pathname || "",
            );

        function openOrderTypeModal() {
            if (isReservationPage) return;
            openModal(orderModal);
        }
        if (urlTableId) {
            localStorage.setItem(STORAGE_KEYS.tableId, urlTableId);
        }
        if (urlToken) {
            localStorage.setItem("tableOrderToken", urlToken);
        }

        // Eğer URL'den hiçbir parametre gelmediyse ve branchSelectionType yoksa manuel olarak işaretle
        if (!urlBranchId && !urlOrderType && !urlTableId && !urlToken) {
            const existingType = localStorage.getItem(
                STORAGE_KEYS.branchSelectionType,
            );
            if (!existingType) {
                localStorage.setItem(STORAGE_KEYS.branchSelectionType, "manual");
            }
        }

        // URL'den aldıktan sonra temizle
        if (urlBranchId || urlOrderType || urlTableId) {
            cleanUrl();
        }

        // localStorage'den al
        let selectedBranchId = localStorage.getItem(STORAGE_KEYS.branchId);
        let selectedOrderType = localStorage.getItem(STORAGE_KEYS.orderType);

        // Tek şube: otomatik seç, tüm localStorage'ı seçilmiş şube gibi doldur
        if (branches.length === 1 && !isMultiBranch) {
            const singleBranch = branches[0];
            const branchId = String(singleBranch.id);
            selectedBranchId = branchId;
            localStorage.setItem(STORAGE_KEYS.branchId, branchId);
            localStorage.setItem("menuCompanyId", branchId);
            localStorage.setItem(STORAGE_KEYS.branchSelectionType, "auto");
        } else if (!selectedBranchId && defaultBranchId) {
            selectedBranchId = String(defaultBranchId);
            localStorage.setItem(STORAGE_KEYS.branchId, selectedBranchId);
        }

        // Token'dan masa bilgisini çek ve otomatik seç (tableOrder için)
        async function resolveTableFromTokenSilent(token) {
            try {
                const lang = getAjaxLang();
                const url = getSiteRoot() + `/yeppanel/db/ajax/web/table-token.php?token=${encodeURIComponent(token)}&lang=${encodeURIComponent(lang)}`;
                console.log("Token API çağrısı yapılıyor:", url);
                const response = await fetch(url);
                const result = await response.json();
                console.log("Token API yanıtı:", result);

                if (result?.success && result.data?.table_id) {
                    return {
                        branchId: result.data.branch_id,
                        tableId: result.data.table_id,
                        tableName: result.data.table_name || null,
                    };
                }
            } catch (error) {
                console.error("Token resolve error:", error);
            }
            return null;
        }

        // URL'den token varsa veya localStorage'da token varsa kullan
        const tokenToUse = urlToken || localStorage.getItem("tableOrderToken");
        if (selectedOrderType === "tableOrder" && tokenToUse && !urlTableId) {
            const resolved = await resolveTableFromTokenSilent(tokenToUse);
            if (resolved?.tableId) {
                // Token'dan gelen branch_id varsa onu kullan, yoksa mevcut branch_id'yi kullan
                const finalBranchId = resolved.branchId || selectedBranchId;
                // Masa bilgisini localStorage'a kaydet (table_id = yep_tables.tables_id)
                localStorage.setItem(STORAGE_KEYS.tableId, String(resolved.tableId));
                localStorage.setItem(STORAGE_KEYS.branchId, String(finalBranchId));
                if (resolved.tableName) {
                    try { localStorage.setItem("menuTableName", String(resolved.tableName)); } catch (e) { }
                }
                selectedBranchId = String(finalBranchId);
            }
        }

        function cleanUrl() {
            // URL'den parametreleri temizle, sadece base URL kalsın
            const url = new URL(window.location.href);
            const cleanPath = url.origin + url.pathname;
            window.history.replaceState({}, document.title, cleanPath);
        }

        function getCurrentBranch() {
            return (
                branches.find((b) => String(b.id) === String(selectedBranchId)) ||
                branches.find((b) => b.isDefault) ||
                branches[0] ||
                null
            );
        }

        // Seçili sipariş tipi bu şubede kapalıysa (panelden kapatılmışsa) tableMenu'ye geçir ve bilgilendir
        const currentBranch = getCurrentBranch();
        if (
            currentBranch &&
            selectedOrderType &&
            currentBranch.orderTypes &&
            currentBranch.orderTypes[selectedOrderType] === false
        ) {
            selectedOrderType = "tableMenu";
            localStorage.setItem(STORAGE_KEYS.orderType, selectedOrderType);
            if (window.Swal && typeof window.Swal.fire === "function") {
                const title = window.I18N?.t?.("order_type_disabled_redirect_title", "Sipariş tipi değişti");
                const text = window.I18N?.t?.("order_type_disabled_redirect_text", "Seçtiğiniz sipariş tipi bu şubede artık sunulmuyor. Masa menüsüne yönlendirildiniz.");
                window.Swal.fire({
                    title: title,
                    text: text,
                    icon: "info",
                    confirmButtonText: window.I18N?.t?.("ok", "Tamam"),
                    confirmButtonColor: "#8C734B",
                });
            }
        }

        function renderBranches() {
            branchList.innerHTML = "";
            const currentSelectedId = localStorage.getItem(STORAGE_KEYS.branchId);
            const selectionType = localStorage.getItem(
                STORAGE_KEYS.branchSelectionType,
            );

            // selectedBranchId değişkenini güncelle
            if (currentSelectedId) {
                selectedBranchId = String(currentSelectedId);
            }

            // Seçili şubeyi bul ve en üste taşı
            const selectedBranch = branches.find(
                (b) => String(b.id) === String(currentSelectedId),
            );
            const otherBranches = branches.filter(
                (b) => String(b.id) !== String(currentSelectedId),
            );
            let sortedBranches = selectedBranch
                ? [selectedBranch, ...otherBranches]
                : branches;

            const branchSearchQuery = (branchSearchInput && branchSearchInput.value.trim()) || "";
            if (branchSearchQuery) {
                const q = branchSearchQuery.toLowerCase();
                sortedBranches = sortedBranches.filter(
                    (b) =>
                        (b.name || "").toLowerCase().includes(q) ||
                        (b.city || "").toLowerCase().includes(q) ||
                        (b.district || "").toLowerCase().includes(q),
                );
            }

            sortedBranches.forEach((branch) => {
                const isSelected = String(branch.id) === String(currentSelectedId);
                const item = document.createElement("button");
                item.type = "button";
                item.className = "selection-item";
                if (isSelected) {
                    item.classList.add("selected");
                }
                item.dataset.branchId = branch.id;

                const badgeText = isSelected ? '<i class="fas fa-check"></i>' : "Seç";
                item.innerHTML = `
          <div>
            <div class="selection-item-title">${branch.name}</div>
            <div class="selection-item-subtitle">${[branch.district, branch.city].filter(Boolean).join(" / ") || ""}</div>
          </div>
          <span class="selection-item-badge">${badgeText}</span>
        `;
                item.addEventListener("click", () => {
                    selectedBranchId = String(branch.id);
                    localStorage.setItem(STORAGE_KEYS.branchId, selectedBranchId);
                    // Manuel seçim yapıldığını işaretle
                    localStorage.setItem(STORAGE_KEYS.branchSelectionType, "manual");
                    // Store company id for backend inserts (if available)
                    try {
                        if (branch.companyId !== undefined && branch.companyId !== null) {
                            localStorage.setItem("menuCompanyId", String(branch.companyId));
                        } else if (
                            branch.company_id !== undefined &&
                            branch.company_id !== null
                        ) {
                            localStorage.setItem("menuCompanyId", String(branch.company_id));
                        } else {
                            // fallback: use branch id as company id in demo mode
                            localStorage.setItem("menuCompanyId", String(branch.id));
                        }
                    } catch (e) {
                        // ignore
                    }
                    closeModal(branchModal);
                    openOrderTypeModal();
                    renderOrderTypes();
                    updateSelectionStatus();
                    emitSelectionChanged();
                });
                branchList.appendChild(item);
            });
        }

        function renderOrderTypes() {
            orderTypeList.innerHTML = "";
            const currentBranch = getCurrentBranch();
            const enabledTypes = Object.entries(orderTypeLabels).filter(
                ([key]) => currentBranch?.orderTypes?.[key],
            );

            // Seçili sipariş tipini güncelle
            const currentOrderType = localStorage.getItem(STORAGE_KEYS.orderType);
            if (currentOrderType) {
                selectedOrderType = currentOrderType;
            }

            // QR ile gelmişse geri butonunu gizle
            if (orderTypeBackBtn) {
                const selectionType = localStorage.getItem(
                    STORAGE_KEYS.branchSelectionType,
                );
                orderTypeBackBtn.style.display =
                    selectionType === "qr" ? "none" : "flex";
            }

            // Sipariş tiplerinde sıralama değişmesin - seçili olsa bile yerinde kalsın
            const sortedTypes = enabledTypes;

            // Sipariş tipi ikon ve renkleri
            const orderTypeConfig = {
                tableMenu: {
                    icon: "fa-utensils",
                    color: "#5A4A31",
                    bgColor: "rgba(90, 74, 49, 0.1)",
                },
                tableOrder: {
                    icon: "fa-table",
                    color: "#8C734B",
                    bgColor: "rgba(140, 115, 75, 0.1)",
                },
                takeaway: {
                    icon: "fa-shopping-bag",
                    color: "#8C734B",
                    bgColor: "#8C734B",
                },
                delivery: {
                    icon: "fa-truck",
                    color: "#C7B28C",
                    bgColor: "#C7B28C",
                },
            };

            sortedTypes.forEach(([key, value]) => {
                const config = orderTypeConfig[key] || {
                    icon: "fa-circle",
                    color: "#8C734B",
                    bgColor: "rgba(140, 115, 75, 0.1)",
                };

                const isSelected = key === selectedOrderType;
                const item = document.createElement("button");
                item.type = "button";
                item.className = "selection-item order-type-item";
                if (isSelected) {
                    item.classList.add("selected");
                }
                item.dataset.orderType = key;
                item.style.setProperty("--order-type-color", config.color);
                item.style.setProperty("--order-type-bg", config.bgColor);

                const badgeText = isSelected ? '<i class="fas fa-check"></i>' : "Seç";
                item.innerHTML = `
          <div class="order-type-item-content">
            <div class="order-type-icon" style="background: ${config.bgColor}; color: ${config.color};">
              <i class="fas ${config.icon}"></i>
            </div>
            <div class="order-type-text">
              <div class="selection-item-title" style="color: ${config.color};">${value.label || key}</div>
              ${value.description ? `<div class="selection-item-subtitle">${value.description}</div>` : ""}
            </div>
          </div>
          <span class="selection-item-badge">${badgeText}</span>
        `;

                item.addEventListener("click", () => {
                    selectedOrderType = key;
                    localStorage.setItem(STORAGE_KEYS.orderType, selectedOrderType);

                    // Masa / Masa menü seçilirse misafir alışverişi kaldır (sadece Paket ve Gel-Al'da geçerli)
                    if (key === "tableOrder" || key === "tableMenu") {
                        const hadGuest = localStorage.getItem("guestOrder") === "1";
                        try { localStorage.removeItem("guestOrder"); } catch (e) { }
                        try { localStorage.removeItem("yeppos_guest_order_contact"); } catch (e) { }
                        try { localStorage.removeItem("yeppos_guest_delivery_address"); } catch (e) { }
                        if (hadGuest) {
                            const msg = window.I18N?.t?.("guest_removed_for_table_type", "Misafir seçimi sadece Paket ve Gel-Al için geçerlidir. Masa siparişi/masa menüsü seçildiği için misafir kaldırıldı.");
                            if (msg && window.Swal && typeof window.Swal.fire === "function") {
                                window.Swal.fire({ text: msg, icon: "info", toast: true, timer: 4000 });
                            }
                        }
                    }

                    // Sipariş tipi seçildiğinde listeyi yeniden render et (seçili item'ı göstermek için)
                    renderOrderTypes();

                    if (selectedOrderType === "tableOrder") {
                        closeModal(orderModal);
                        openModal(tableModal);
                        loadTablesForBranch();
                    } else {
                        closeModal(orderModal);
                        if (document.getElementById("orderPage")) window.location.reload();
                    }
                    updateSelectionStatus();
                    emitSelectionChanged();
                });
                orderTypeList.appendChild(item);
            });
        }

        let cachedTables = [];

        function renderTables(tables = []) {
            tableList.innerHTML = "";
            if (!tables.length) {
                tableList.innerHTML = `<div class="selection-list-loading">Masa bulunamadı.</div>`;
                return;
            }

            // Seçili masayı bul ve en üste taşı
            const currentTableId = localStorage.getItem(STORAGE_KEYS.tableId);
            const selectedTable = tables.find(
                (t) => String(t.id) === String(currentTableId),
            );
            const otherTables = tables.filter(
                (t) => String(t.id) !== String(currentTableId),
            );
            const sortedTables = selectedTable
                ? [selectedTable, ...otherTables]
                : tables;

            sortedTables.forEach((table) => {
                const isSelected = String(table.id) === String(currentTableId);
                const item = document.createElement("button");
                item.type = "button";
                item.className = "selection-item table-item";
                if (isSelected) {
                    item.classList.add("selected");
                }
                item.dataset.tableId = table.id;
                const status = table.status || "available";
                const statusLabel =
                    status === "occupied"
                        ? "Dolu"
                        : status === "reserved"
                            ? "Rezerve"
                            : "Boş";
                // Seçili masaya disabled ekleme
                if (status !== "available" && !isSelected) {
                    item.classList.add("disabled");
                }

                const badgeText = isSelected
                    ? '<i class="fas fa-check"></i>'
                    : statusLabel;
                const badgeClass = isSelected
                    ? "selection-item-badge"
                    : `selection-item-status ${status}`;

                item.innerHTML = `
          <div class="table-item-content">
            <div class="table-item-icon">
              <i class="fas fa-table"></i>
            </div>
            <div class="table-item-text">
              <div class="selection-item-title">${table.name}</div>
              <div class="selection-item-subtitle">${table.area || ""}</div>
            </div>
          </div>
          <span class="${badgeClass}">${badgeText}</span>
        `;
                item.addEventListener("click", () => {
                    // Seçili masayı her zaman seçilebilir yap, diğerlerinde status kontrolü yap
                    if (status !== "available" && !isSelected) return;
                    const selectedTableId = String(table.id);
                    localStorage.setItem(STORAGE_KEYS.tableId, selectedTableId);
                    // Store table label details for order page (name + area)
                    try {
                        if (table.name)
                            localStorage.setItem("menuTableName", String(table.name));
                        if (table.area)
                            localStorage.setItem("menuTableArea", String(table.area));
                    } catch (e) {
                        // ignore storage errors
                    }
                    // Masa seçildiğinde listeyi yeniden render et (seçili item'ı göstermek için)
                    renderTables(cachedTables);
                    closeModal(tableModal);
                    updateSelectionStatus();
                    emitSelectionChanged();
                    if (document.getElementById("orderPage")) window.location.reload();
                });
                tableList.appendChild(item);
            });
        }

        function getOrderTypeLabel(typeKey) {
            const type = orderTypeLabels?.[typeKey];
            return type?.label || typeKey || "";
        }

        function getTableLabel(tableId) {
            return `Masa ${tableId}`;
        }

        function applyTableFilter() {
            const query = (tableSearchInput?.value || "").trim().toLowerCase();
            if (tableSearchClear) {
                tableSearchClear.classList.toggle("visible", Boolean(query));
            }
            if (!query) {
                renderTables(cachedTables);
                return;
            }
            const filtered = cachedTables.filter((table) => {
                const name = (table.name || "").toLowerCase();
                const area = (table.area || "").toLowerCase();
                return name.includes(query) || area.includes(query);
            });
            renderTables(filtered);
        }

        async function loadTablesForBranch() {
            if (!tablesEndpoint || !selectedBranchId) {
                tableList.innerHTML = `<div class="selection-list-loading">Masa bilgisi yok.</div>`;
                return;
            }
            tableList.innerHTML = `<div class="selection-list-loading">Masalar yükleniyor...</div>`;
            try {
                const url = `${tablesEndpoint}?branch_id=${encodeURIComponent(
                    selectedBranchId,
                )}`;
                const response = await fetch(url);
                const result = await response.json();
                if (result?.success && Array.isArray(result.data?.tables)) {
                    cachedTables = result.data.tables;
                    if (tableSearchInput) {
                        tableSearchInput.value = "";
                    }
                    renderTables(cachedTables);
                } else {
                    cachedTables = [];
                    renderTables([]);
                }
            } catch (error) {
                cachedTables = [];
                renderTables([]);
            }
        }

        function updateSelectionStatus() {
            const currentType =
                localStorage.getItem(STORAGE_KEYS.orderType) || selectedOrderType;
            const currentTable =
                localStorage.getItem(STORAGE_KEYS.tableId) || urlTableId;

            updateCartButtonsForOrderType(currentType);

            const translations = window.I18N?.getTranslations?.();
            const lang = window.I18N?.getPreferredLanguage?.() || "tr";
            const t = (key, fallback) =>
                translations?.[lang]?.[key] !== undefined
                    ? translations[lang][key]
                    : fallback;

            if (selectionStatusText) {
                if (currentType === "tableMenu") {
                    selectionStatusText.textContent = t("selection_menu", "Menü");
                } else if (currentType === "tableOrder") {
                    const tableName = localStorage.getItem("menuTableName");
                    selectionStatusText.textContent = tableName
                        ? tableName
                        : (currentTable ? getTableLabel(currentTable) : t("selection_table_pick", "Masa Seç"));
                } else if (currentType === "takeaway") {
                    selectionStatusText.textContent = t("selection_takeaway", "Gel-Al");
                } else if (currentType === "delivery") {
                    selectionStatusText.textContent = t("selection_delivery", "Paket");
                } else {
                    selectionStatusText.textContent = t("selection_label", "Seçim");
                }
            }

            // orderTypeCurrent kaldırıldı - seçili sipariş tipi item'da selected class'ı ile gösteriliyor

            // Call Waiter Button visibility
            const callWaiterBtn = document.getElementById("callWaiterBtn");
            if (callWaiterBtn) {
                const currentBranchId =
                    localStorage.getItem(STORAGE_KEYS.branchId) || selectedBranchId;
                const currentBranch = branches.find(
                    (b) => String(b.id) === String(currentBranchId),
                );

                // Şube seçili + (masa menüsü veya masa siparişi) + callWaiter aktif
                const shouldShow =
                    currentBranchId &&
                    (currentType === "tableMenu" || currentType === "tableOrder") &&
                    currentBranch?.callWaiter === true;

                callWaiterBtn.style.display = shouldShow ? "inline-flex" : "none";

                // Update desktop cart button position based on callWaiterBtn visibility
                // Use setTimeout to ensure DOM is updated before checking visibility
                if (
                    window.menuPage &&
                    typeof window.menuPage.updateDesktopCartButtonPosition === "function"
                ) {
                    setTimeout(() => {
                        window.menuPage.updateDesktopCartButtonPosition();
                    }, 0);
                }
            } else {
                // If callWaiterBtn doesn't exist, set default position
                if (
                    window.menuPage &&
                    typeof window.menuPage.updateDesktopCartButtonPosition === "function"
                ) {
                    window.menuPage.updateDesktopCartButtonPosition();
                }
            }
        }

        let html5QrScanner = null;
        let qrScanProcessing = false; // Aynı QR için callback'in tek tetiklenmesi

        function setQrStatus(key, fallback) {
            if (!qrScanStatus) return;
            const translations = window.I18N?.getTranslations?.();
            const lang = window.I18N?.getPreferredLanguage?.() || "tr";
            const text =
                translations?.[lang]?.[key] !== undefined
                    ? translations[lang][key]
                    : fallback;
            qrScanStatus.textContent = text;
        }

        async function startQrScanner() {
            // Önceki instance varsa temizle; ikinci açılışta her zaman yeni scanner
            if (html5QrScanner) {
                await stopQrScanner();
            }
            qrScanProcessing = false;

            // Container'ı tamamen boşalt (çift kamera görüntüsünü önle)
            if (qrScanReader) {
                qrScanReader.innerHTML = "";
            }

            // Her durumda modalı aç
            if (qrScanModal) {
                openModal(qrScanModal);
            }

            if (!qrScanModal || !qrScanReader) {
                setQrStatus("qr_scan_no_camera", "DEBUG: Modal/Reader bulunamadı");
                return;
            }

            if (!window.Html5Qrcode) {
                setQrStatus("qr_scan_not_supported", "DEBUG: Html5Qrcode yüklenmedi");
                return;
            }

            if (!window.isSecureContext) {
                setQrStatus("qr_scan_https", "DEBUG: HTTPS gerekli");
                return;
            }
            setQrStatus("qr_scan_waiting", "Kamera bekleniyor...");

            try {
                html5QrScanner = new Html5Qrcode("qrScanReader");

                await html5QrScanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                    },
                    async (decodedText) => {
                        if (qrScanProcessing) return;
                        qrScanProcessing = true;
                        try {
                            await html5QrScanner?.stop().catch(() => { });
                        } catch (e) { }
                        html5QrScanner = null;
                        try {
                            await handleQrResult(decodedText);
                        } finally {
                            if (qrScanModal) closeModal(qrScanModal);
                            qrScanProcessing = false;
                        }
                    },
                    (errorMessage) => {
                        // Sürekli hata mesajları gösterme
                    },
                );

                setQrStatus("qr_scan_waiting", "QR kod aranıyor...");
            } catch (error) {
                html5QrScanner = null; // Hata durumunda null yap
                const errorMsg = error?.message || error?.toString() || "Bilinmeyen";
                if (
                    errorMsg.includes("NotAllowedError") ||
                    errorMsg.includes("Permission") ||
                    errorMsg.includes("permission")
                ) {
                    setQrStatus("qr_scan_permission", "İzin reddedildi");
                } else if (errorMsg.includes("NotFoundError")) {
                    setQrStatus("qr_scan_no_camera", "Kamera bulunamadı");
                } else {
                    setQrStatus(
                        "qr_scan_no_camera",
                        "HATA: " + errorMsg.substring(0, 60),
                    );
                }
            }
        }

        async function stopQrScanner() {
            if (html5QrScanner) {
                try {
                    await html5QrScanner.stop();
                    html5QrScanner.clear();
                } catch (error) {
                    // Zaten kapalı
                }
                html5QrScanner = null;
            }
            if (qrScanModal) {
                closeModal(qrScanModal);
            }
        }

        async function resolveTableFromToken(token) {
            setQrStatus("qr_scan_resolving", "Masa doğrulanıyor...");

            // Spinner göster (QR reader içinde zaten var)
            if (qrScanReader) {
                qrScanReader.style.opacity = "0.5";
            }

            try {
                const lang = getAjaxLang();
                const url = getSiteRoot() + `/yeppanel/db/ajax/web/table-token.php?token=${encodeURIComponent(
                    token,
                )}&lang=${encodeURIComponent(lang)}&_=${Date.now()}`;
                const response = await fetch(url, { cache: "no-store" });
                const result = await response.json();

                // Spinner gizle
                if (qrScanReader) {
                    qrScanReader.style.opacity = "1";
                }

                if (result?.success && result.data?.table_id) {
                    return {
                        branchId: result.data.branch_id,
                        tableId: result.data.table_id,
                        tableName: result.data.table_name || null,
                    };
                }
            } catch (error) {
                console.error("Token resolve error:", error);
                if (qrScanReader) {
                    qrScanReader.style.opacity = "1";
                }
                return null;
            }
            return null;
        }

        async function handleQrResult(rawValue) {
            const cleanValue = (rawValue || "")
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .trim();

            let url;
            try {
                if (/^https?:\/\//i.test(cleanValue)) {
                    url = new URL(cleanValue);
                } else {
                    url = new URL(cleanValue, window.location.origin);
                }
            } catch (error) {
                setQrStatus("qr_scan_no_camera", "Geçersiz QR kod");
                stopQrScanner();
                return;
            }

            const getParam = (key) => (url ? url.searchParams.get(key) : null);
            const companyId = getParam("company_id");
            const orderType = getParam("type") || "tableOrder";
            const tableIdParam = getParam("table") || getParam("t");
            const token = getParam("table_token") || getParam("token");

            // Öncelik: token varsa her zaman token ile yep_tables.tables_token üzerinden masayı seç (table/t parametresini yok say)
            if (token) {
                setQrStatus("qr_scan_resolving", "Masa doğrulanıyor...");
                const resolved = await resolveTableFromToken(token);
                if (resolved?.tableId) {
                    // Önce masa adını yaz (toast ve status bu değeri kullanıyor)
                    if (resolved.tableName) {
                        try { localStorage.setItem("menuTableName", String(resolved.tableName)); } catch (e) { }
                    }
                    const finalBranchId = resolved.branchId != null ? String(resolved.branchId) : (companyId || "");
                    applyTableSelection(finalBranchId, resolved.tableId, orderType);
                    setQrStatus("qr_scan_waiting", (resolved.tableName || ("Masa " + resolved.tableId)) + " seçildi!");
                    // setTimeout(() => { window.location.reload(); }, 800);
                    return;
                }
                setQrStatus("qr_scan_no_camera", "Masa bulunamadı");
                stopQrScanner();
                return;
            }

            // Token yoksa direkt table/t parametresi varsa onu kullan
            if (tableIdParam) {
                applyTableSelection(companyId, tableIdParam, orderType);
                setQrStatus("qr_scan_waiting", `Masa ${tableIdParam} seçildi!`);
                setTimeout(() => { window.location.reload(); }, 800);
                return;
            }

            // Token yoksa uyarı göster
            if (window.Swal && typeof window.Swal.fire === "function") {
                const title = window.I18N?.t
                    ? window.I18N.t("qr_scan_no_token_title", "Token Bulunamadı")
                    : "Token Bulunamadı";
                const message = window.I18N?.t
                    ? window.I18N.t(
                        "qr_scan_no_token_message",
                        "Masa token bulunamadı. Lütfen masayı manuel seçiniz.",
                    )
                    : "Masa token bulunamadı. Lütfen masayı manuel seçiniz.";

                await window.Swal.fire({
                    title: title,
                    text: message,
                    icon: "warning",
                    confirmButtonText: window.I18N?.t
                        ? window.I18N.t("ok", "Tamam")
                        : "Tamam",
                    confirmButtonColor: "#8C734B",
                });
            } else {
                setQrStatus(
                    "qr_scan_no_camera",
                    "Masa token bulunamadı. Lütfen masayı manuel seçiniz.",
                );
            }

            stopQrScanner();
        }

        async function applyTableSelection(branchId, tableId, orderType) {
            // QR'dan gelen company_id (branchId) varsa güncelle
            if (branchId) {
                selectedBranchId = String(branchId);
                localStorage.setItem(STORAGE_KEYS.branchId, selectedBranchId);
                renderOrderTypes();
            }

            // QR'dan gelen order type varsa kullan, yoksa tableOrder varsayılan
            selectedOrderType = orderType || "tableOrder";
            localStorage.setItem(STORAGE_KEYS.orderType, selectedOrderType);
            localStorage.setItem(STORAGE_KEYS.tableId, String(tableId));

            // Tüm modalları kapat
            closeModal(tableModal);
            closeModal(orderModal);
            closeModal(branchModal);

            // Durumu güncelle - URL'ye yazmıyoruz, sadece UI güncellemesi
            updateSelectionStatus();
            emitSelectionChanged();

            // Toast notification göster
            showTableSelectionToast(tableId);
        }

        function showTableSelectionToast(tableId) {
            const translations = window.I18N?.getTranslations?.();
            const lang = window.I18N?.getPreferredLanguage?.() || "tr";
            const tableName = (typeof localStorage !== "undefined" && localStorage.getItem("menuTableName")) || tableId;
            const titleText = lang === "tr" ? "Masa Seçildi!" : "Table Selected!";
            const descText =
                lang === "tr"
                    ? (tableName ? tableName + " seçildi. Şimdi sipariş verebilirsiniz." : "Masa seçildi. Şimdi sipariş verebilirsiniz.")
                    : (tableName ? tableName + " selected. You can now order." : "Table selected. You can now order.");

            if (window.Swal && typeof window.Swal.fire === "function") {
                window.Swal.fire({
                    icon: "success",
                    title: titleText,
                    text: descText,
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    width: "auto",
                    padding: "1rem 1.5rem",
                });
            }
        }

        async function handleCallWaiter() {
            const tableId = localStorage.getItem(STORAGE_KEYS.tableId);
            const translations = window.I18N?.getTranslations?.();
            const lang = window.I18N?.getPreferredLanguage?.() || "tr";

            const t = (key, fallback) =>
                translations?.[lang]?.[key] !== undefined
                    ? translations[lang][key]
                    : fallback;

            // Eğer masa seçili değilse, masa seçme ekranını aç
            if (!tableId) {
                console.log("Masa seçili değil, masa seçme ekranı açılıyor");
                openModal(tableModal);
                loadTablesForBranch();
                return;
            }

            // Cooldown kontrolü (3 dakika = 180 saniye)
            const COOLDOWN_DURATION = 180 * 1000; // 3 dakika milisaniye cinsinden
            const lastCallTimeKey = `callWaiterLastCall_${tableId}`;
            const lastCallTime = localStorage.getItem(lastCallTimeKey);

            if (lastCallTime) {
                const timeSinceLastCall = Date.now() - parseInt(lastCallTime);
                const remainingTime = COOLDOWN_DURATION - timeSinceLastCall;

                if (remainingTime > 0) {
                    // Henüz cooldown süresi dolmamış
                    const remainingSeconds = Math.ceil(remainingTime / 1000);

                    await window.Swal.fire({
                        title: t("call_waiter_cooldown_title", "Çok Sık Çağrı"),
                        text: t(
                            "call_waiter_cooldown_message",
                            "Garson çağrısı yapabilmek için {seconds} saniye daha beklemeniz gerekiyor. Lütfen bekleyin.",
                        ).replace("{seconds}", remainingSeconds),
                        icon: "warning",
                        confirmButtonText: t("ok", "Tamam"),
                        confirmButtonColor: "#8C734B",
                        timer: 3000,
                        timerProgressBar: true,
                        toast: true,
                        position: "top-end",
                        showConfirmButton: true,
                        width: "auto",
                        padding: "1rem 1.5rem",
                    });

                    return;
                }
            }

            // Reason modal'ı aç
            const reasonModal = document.getElementById("callWaiterModalOverlay");
            const reasonBtns = document.querySelectorAll(".call-waiter-reason-btn");
            const confirmBtn = document.getElementById("callWaiterConfirmBtn");
            const cancelBtn = document.getElementById("callWaiterCancelBtn");

            if (!reasonModal) {
                console.error("Call waiter reason modal bulunamadı");
                return;
            }

            let selectedReason = null;
            let selectedReasonId = null;

            // Modal'ı aç
            reasonModal.classList.add("active");
            document.body.style.overflow = "hidden";

            // i18n güncellemesi
            if (window.I18N && window.I18N.updateElements) {
                window.I18N.updateElements();
            }

            // Reason butonlarına click event ekle
            const handleReasonClick = (e) => {
                const btn = e.currentTarget;
                const reason = btn.dataset.reason;
                const reasonId = btn.dataset.reasonId != null ? parseInt(btn.dataset.reasonId, 10) : null;

                reasonBtns.forEach((b) => b.classList.remove("selected"));
                btn.classList.add("selected");
                selectedReason = reason;
                selectedReasonId = reasonId;

                confirmBtn.disabled = false;
            };

            reasonBtns.forEach((btn) => {
                btn.addEventListener("click", handleReasonClick);
            });

            // Confirm butonuna click event ekle
            const tableName = localStorage.getItem(STORAGE_KEYS.tableName) || localStorage.getItem("menuTableName") || tableId || "";
            const branchId = selectedBranchId || localStorage.getItem("menuBranchId") || "";
            const companyId = typeof getRegisterCompanyId === "function" ? getRegisterCompanyId() : (localStorage.getItem("menuCompanyId") || localStorage.getItem("menuBranchId") || "48");
            const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

            const buildCallWaiterPayload = (opts) => {
                const reasonVal = opts.reason !== undefined ? opts.reason : selectedReason;
                const reasonIdVal = opts.reason_id !== undefined ? opts.reason_id : selectedReasonId;
                const base = {
                    reason: reasonVal,
                    reason_id: reasonIdVal,
                    table_id: tableId,
                    table_name: tableName,
                    company_id: companyId,
                    is_logged_in: !!opts.isLoggedIn,
                    lang: lang,
                    user_agent: navigator.userAgent || "",
                    screen: (window.screen && (window.screen.width + "x" + window.screen.height)) || "",
                    language: navigator.language || "",
                    client_ip: (window._callWaiterClientIp || "").trim(),
                };
                if (opts.isLoggedIn) {
                    base.user_phone = (localStorage.getItem("userPhone") || "").replace(/\D/g, "").slice(-10);
                    base.user_name = [localStorage.getItem("userFirstName"), localStorage.getItem("userLastName")].filter(Boolean).join(" ").trim() || localStorage.getItem("userName") || "";
                    base.user_email = localStorage.getItem("userEmail") || "";
                } else {
                    base.phone = opts.phone || "";
                    base.code = opts.code || "";
                }
                return base;
            };

            const submitCallWaiter = async (payload) => {
                const baseUrl = (typeof getSiteRoot === "function" ? getSiteRoot() : (window.getSiteRoot && window.getSiteRoot())) || "";
                const res = await fetch(baseUrl + "/yeppanel/db/ajax/web/call-waiter.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const data = await res.json().catch(() => ({}));
                return data;
            };

            const showCallWaiterSuccess = () => {
                localStorage.setItem(lastCallTimeKey, Date.now().toString());
                const successMessage = t("call_waiter_success", "Masa {tableId} adlı masaya garson çağrısı yapılmıştır. Teşekkürler!").replace("{tableId}", tableId);
                window.Swal.fire({
                    title: t("call_waiter_success_title", "Garson Çağrıldı"),
                    text: successMessage,
                    icon: "success",
                    confirmButtonText: t("ok", "Tamam"),
                    confirmButtonColor: "#8C734B",
                    timer: 2000,
                    timerProgressBar: true,
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    width: "auto",
                    padding: "0.31rem 0.85rem",
                });
            };

            let confirmInProgress = false;
            const handleConfirm = async () => {
                if (confirmInProgress || !selectedReason) return;
                confirmInProgress = true;
                confirmBtn.removeEventListener("click", handleConfirm);
                confirmBtn.disabled = true;

                const savedReason = selectedReason;
                const savedReasonId = selectedReasonId;
                reasonModal.classList.remove("active");
                document.body.style.overflow = "";
                reasonBtns.forEach((btn) => btn.removeEventListener("click", handleReasonClick));
                cancelBtn.removeEventListener("click", handleCancel);
                selectedReason = null;
                selectedReasonId = null;
                reasonBtns.forEach((b) => b.classList.remove("selected"));

                if (isLoggedIn) {
                    const payload = buildCallWaiterPayload({ isLoggedIn: true, reason: savedReason, reason_id: savedReasonId });
                    const data = await submitCallWaiter(payload);
                    if (data && data.success) {
                        showCallWaiterSuccess();
                    } else {
                        window.Swal.fire({
                            title: t("call_waiter_success_title", "Garson Çağrıldı"),
                            text: (data && data.message) || "İstek gönderilemedi.",
                            icon: "error",
                            confirmButtonText: t("ok", "Tamam"),
                        });
                    }
                    return;
                }

                let branchSmsRequired = true;
                const currentBranch = getCurrentBranch();
                if (currentBranch && currentBranch.waiterCallSmsRequired === false) {
                    branchSmsRequired = false;
                }
                if (branchSmsRequired) {
                    const baseUrl = (typeof getSiteRoot === "function" ? getSiteRoot() : (window.getSiteRoot && window.getSiteRoot())) || "";
                    try {
                        const headerRes = await fetch(baseUrl + "/yeppanel/db/ajax/web/header.php?lang=" + encodeURIComponent(lang));
                        const headerJson = await headerRes.json();
                        const app = headerJson?.data?.app || headerJson?.app || {};
                        const branchListFresh = Array.isArray(app.branches) ? app.branches : [];
                        const bid = selectedBranchId || localStorage.getItem(STORAGE_KEYS.branchId);
                        const branchFresh = bid ? branchListFresh.find(function (b) { return String(b.id) === String(bid); }) : (branchListFresh[0] || null);
                        if (branchFresh && branchFresh.waiterCallSmsRequired === false) branchSmsRequired = false;
                    } catch (e) { }
                }
                if (!branchSmsRequired) {
                    const payload = buildCallWaiterPayload({ isLoggedIn: false, reason: savedReason, reason_id: savedReasonId });
                    const data = await submitCallWaiter(payload);
                    if (data && data.success) {
                        showCallWaiterSuccess();
                    } else {
                        window.Swal.fire({
                            title: t("call_waiter_success_title", "Garson Çağrıldı"),
                            text: (data && data.message) || "İstek gönderilemedi.",
                            icon: "error",
                            confirmButtonText: t("ok", "Tamam"),
                        });
                    }
                    return;
                }

                window._callWaiterPending = {
                    reason: savedReason,
                    reason_id: savedReasonId,
                    buildCallWaiterPayload,
                    submitCallWaiter,
                    showCallWaiterSuccess,
                    lastCallTimeKey,
                    t,
                    tableId,
                };
                const phoneModal = document.getElementById("callWaiterPhoneModal");
                const phoneInput = document.getElementById("callWaiterPhoneInput");
                const phoneError = document.getElementById("callWaiterPhoneError");
                const phoneSend = document.getElementById("callWaiterPhoneSend");
                const phoneClose = document.getElementById("callWaiterPhoneClose");
                if (phoneModal && phoneInput) {
                    phoneInput.value = "";
                    if (phoneError) phoneError.textContent = "";
                    if (phoneSend) phoneSend.disabled = false;
                    phoneModal.classList.add("active");
                    document.body.style.overflow = "hidden";
                    setTimeout(() => phoneInput.focus(), 100);
                    const baseUrlForIp = (typeof getSiteRoot === "function" ? getSiteRoot() : (window.getSiteRoot && window.getSiteRoot())) || "";
                    fetch(baseUrlForIp + "/yeppanel/db/ajax/web/get-client-ip.php").then((r) => r.json()).then((d) => { if (d && d.ip) window._callWaiterClientIp = d.ip; }).catch(() => { });
                }
                let phoneSendInProgress = false;
                const onPhoneSend = async () => {
                    if (phoneSendInProgress) return;
                    const raw = (phoneInput && phoneInput.value || "").replace(/\D/g, "");
                    if (raw.length !== 10 || !/^[2-5]/.test(raw)) {
                        if (phoneError) phoneError.textContent = "Geçerli bir telefon numarası girin (5XX XXX XX XX).";
                        return;
                    }
                    if (phoneError) phoneError.textContent = "";
                    phoneSendInProgress = true;
                    if (phoneSend) {
                        phoneSend.disabled = true;
                        phoneSend.removeEventListener("click", onPhoneSend);
                    }
                    const baseUrl = (typeof getSiteRoot === "function" ? getSiteRoot() : (window.getSiteRoot && window.getSiteRoot())) || "";
                    try {
                        const res = await fetch(baseUrl + "/yeppanel/db/ajax/web/send-sms-code.php", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ phone: raw, company_id: companyId, call_waiter: true, lang: lang }),
                        });
                        const data = await res.json().catch(() => ({}));
                        if (data && data.success) {
                            phoneModal.classList.remove("active");
                            document.body.style.overflow = "";
                            phoneSend.removeEventListener("click", onPhoneSend);
                            const codeModal = document.getElementById("callWaiterCodeModal");
                            const codeInputs = document.querySelectorAll("#callWaiterCodeInputs .verification-code-input");
                            const codeError = document.getElementById("callWaiterCodeError");
                            const codeVerify = document.getElementById("callWaiterCodeVerify");
                            const codePhoneDisplay = document.getElementById("callWaiterCodePhoneDisplay");
                            const codeClose = document.getElementById("callWaiterCodeClose");
                            const codeChangePhone = document.getElementById("callWaiterCodeChangePhone");
                            if (codePhoneDisplay) codePhoneDisplay.textContent = "0" + raw;
                            codeInputs.forEach((inp) => { inp.value = ""; });
                            if (codeError) codeError.textContent = "";
                            if (codeModal) {
                                codeModal.classList.add("active");
                                document.body.style.overflow = "hidden";
                                setTimeout(() => codeInputs[0] && codeInputs[0].focus(), 100);
                            }
                            const getCodeValue = () => Array.from(codeInputs).map((i) => i.value).join("");
                            const applyCodeDigits = (rawDigits, startIdx) => {
                                const digits = String(rawDigits || "").replace(/\D/g, "").slice(0, 4);
                                if (!digits) return;
                                let cursor = startIdx;
                                for (let i = 0; i < digits.length && cursor < codeInputs.length; i++) {
                                    codeInputs[cursor].value = digits[i];
                                    cursor += 1;
                                }
                                if (codeInputs.length) {
                                    codeInputs[Math.min(cursor, codeInputs.length - 1)].focus();
                                }
                            };
                            const onCodeInput = (e) => {
                                const el = e.target;
                                const idx = parseInt(el.dataset.idx, 10);
                                const clean = String(el.value || "").replace(/\D/g, "");
                                if (clean.length > 1) {
                                    el.value = "";
                                    applyCodeDigits(clean, idx);
                                } else {
                                    el.value = clean;
                                    if (clean && idx < 3) codeInputs[idx + 1].focus();
                                }
                            };
                            const onCodePaste = (e) => {
                                const pasted = (e.clipboardData && e.clipboardData.getData("text")) || "";
                                if (!String(pasted).replace(/\D/g, "")) return;
                                e.preventDefault();
                                const firstIdx = parseInt((e.target && e.target.dataset && e.target.dataset.idx) || "0", 10) || 0;
                                applyCodeDigits(pasted, firstIdx);
                            };
                            const onCodeKeydown = (e) => {
                                const el = e.target;
                                const idx = parseInt(el.dataset.idx, 10);
                                if (e.key === "Backspace" && !el.value && idx > 0) codeInputs[idx - 1].focus();
                            };
                            codeInputs.forEach((inp) => {
                                inp.addEventListener("input", onCodeInput);
                                inp.addEventListener("paste", onCodePaste);
                                inp.addEventListener("keydown", onCodeKeydown);
                            });
                            let verifyInProgress = false;
                            const onVerify = async () => {
                                if (verifyInProgress) return;
                                const code = getCodeValue();
                                if (code.length !== 4) {
                                    if (codeError) codeError.textContent = "4 haneli kodu girin.";
                                    return;
                                }
                                if (codeError) codeError.textContent = "";
                                verifyInProgress = true;
                                if (codeVerify) {
                                    codeVerify.disabled = true;
                                    codeVerify.removeEventListener("click", onVerify);
                                }
                                try {
                                    const verifyRes = await fetch(baseUrl + "/yeppanel/db/ajax/web/order-verify-code.php", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ phone: raw, code: code, call_waiter: true }),
                                    });
                                    const verifyData = await verifyRes.json().catch(() => ({}));
                                    if (verifyData && verifyData.success) {
                                        const p = window._callWaiterPending;
                                        const payload = p && p.buildCallWaiterPayload
                                            ? p.buildCallWaiterPayload({ isLoggedIn: false, phone: raw, code: code, reason: p.reason, reason_id: p.reason_id })
                                            : { reason: (p && p.reason) || "", reason_id: (p && p.reason_id) || 0, table_id: tableId, table_name: tableName, company_id: companyId, phone: raw, code: code, is_logged_in: false, lang: lang, user_agent: navigator.userAgent || "", screen: (window.screen && (window.screen.width + "x" + window.screen.height)) || "", language: navigator.language || "" };
                                        const submitData = await submitCallWaiter(payload);
                                        if (submitData && submitData.success) {
                                            closeCodeModalAndCleanup();
                                            showCallWaiterSuccess();
                                            if (window._callWaiterPending) window._callWaiterPending = null;
                                        } else {
                                            if (codeError) codeError.textContent = (submitData && submitData.message) || "Gönderilemedi.";
                                        }
                                    } else {
                                        if (codeError) codeError.textContent = (verifyData && verifyData.message) || "Kod hatalı.";
                                    }
                                } finally {
                                    verifyInProgress = false;
                                    if (codeVerify) codeVerify.disabled = false;
                                }
                            };
                            const closeCodeModalAndCleanup = () => {
                                codeModal.classList.remove("active");
                                document.body.style.overflow = "";
                                codeVerify.removeEventListener("click", onVerify);
                                codeClose && codeClose.removeEventListener("click", closeCodeModalAndCleanup);
                                codeChangePhone && codeChangePhone.removeEventListener("click", onChangePhone);
                            };
                            const onChangePhone = () => {
                                closeCodeModalAndCleanup();
                                codeInputs.forEach((inp) => { inp.value = ""; });
                                if (codeError) codeError.textContent = "";
                                phoneSendInProgress = false;
                                if (phoneSend) phoneSend.disabled = false;
                                phoneModal.classList.add("active");
                                document.body.style.overflow = "hidden";
                                phoneInput.value = raw;
                                if (phoneError) phoneError.textContent = "";
                                phoneSend && phoneSend.addEventListener("click", onPhoneSend);
                                setTimeout(() => phoneInput.focus(), 100);
                            };
                            codeVerify.addEventListener("click", onVerify);
                            codeClose && codeClose.addEventListener("click", closeCodeModalAndCleanup);
                            codeChangePhone && codeChangePhone.addEventListener("click", onChangePhone);
                        } else {
                            if (phoneError) phoneError.textContent = (data && data.message) || "SMS gönderilemedi.";
                            phoneSendInProgress = false;
                            if (phoneSend) { phoneSend.disabled = false; phoneSend.addEventListener("click", onPhoneSend); }
                        }
                    } finally {
                        if (!phoneSendInProgress && phoneSend) phoneSend.disabled = false;
                    }
                };
                phoneSend && phoneSend.addEventListener("click", onPhoneSend);
                phoneClose && phoneClose.addEventListener("click", () => {
                    phoneModal.classList.remove("active");
                    document.body.style.overflow = "";
                    phoneSend.removeEventListener("click", onPhoneSend);
                });
            };

            // Cancel butonuna click event ekle
            const handleCancel = () => {
                // Modal'ı kapat
                reasonModal.classList.remove("active");
                document.body.style.overflow = "";

                // Event listener'ları temizle
                reasonBtns.forEach((btn) => {
                    btn.removeEventListener("click", handleReasonClick);
                });
                confirmBtn.removeEventListener("click", handleConfirm);
                cancelBtn.removeEventListener("click", handleCancel);

                // Reset
                selectedReason = null;
                selectedReasonId = null;
                reasonBtns.forEach((b) => b.classList.remove("selected"));
                confirmBtn.disabled = true;
            };

            confirmBtn.addEventListener("click", handleConfirm);
            cancelBtn.addEventListener("click", handleCancel);

            // Overlay'e tıklayınca kapat
            reasonModal.addEventListener("click", (e) => {
                if (e.target === reasonModal) {
                    handleCancel();
                }
            });
        }

        function updateCartButtonsForOrderType(orderType) {
            const fixedCartBtn = document.getElementById("fixedCartBtn");
            const mobileCartBtn = document.getElementById("mobileCartBtn");
            const shouldHide = orderType === "tableMenu";

            if (fixedCartBtn) {
                if (shouldHide) {
                    fixedCartBtn.style.setProperty("display", "none", "important");
                } else {
                    fixedCartBtn.style.removeProperty("display");
                }
            }

            if (mobileCartBtn) {
                if (shouldHide) {
                    mobileCartBtn.style.setProperty("display", "none", "important");
                } else {
                    mobileCartBtn.style.removeProperty("display");
                }
            }
        }

        function emitSelectionChanged() {
            if (!selectedBranchId || !selectedOrderType) {
                return;
            }
            const tableId = localStorage.getItem(STORAGE_KEYS.tableId) || urlTableId;
            if (selectedOrderType === "tableOrder" && !tableId) {
                return;
            }
            const detail = {
                branchId: selectedBranchId,
                orderType: selectedOrderType,
                tableId: tableId || null,
            };
            window.MenuSelection = detail;
            document.dispatchEvent(
                new CustomEvent("menuSelectionChanged", { detail }),
            );
        }

        if (orderTypeBackBtn) {
            // QR ile gelmişse geri butonunu gizle
            const selectionType = localStorage.getItem(
                STORAGE_KEYS.branchSelectionType,
            );
            if (selectionType === "qr") {
                orderTypeBackBtn.style.display = "none";
            }

            orderTypeBackBtn.addEventListener("click", () => {
                closeModal(orderModal);
                const selectionType = localStorage.getItem(
                    STORAGE_KEYS.branchSelectionType,
                );
                // QR ile gelmişse şube seçim modalını açma
                if (isMultiBranch && selectionType !== "qr") {
                    if (branchSearchInput) { branchSearchInput.value = ""; if (branchSearchWrap) branchSearchWrap.classList.remove("has-value"); }
                    renderBranches();
                    openModal(branchModal);
                }
            });
        }
        if (tableBackBtn) {
            tableBackBtn.addEventListener("click", () => {
                closeModal(tableModal);
                openOrderTypeModal();
            });
        }
        if (qrScanBtn) {
            qrScanBtn.addEventListener("click", () => {
                startQrScanner();
            });
        }
        if (qrScanCloseBtn) {
            qrScanCloseBtn.addEventListener("click", () => {
                stopQrScanner();
            });
        }
        if (tableSearchInput) {
            tableSearchInput.addEventListener("input", applyTableFilter);
        }
        if (tableSearchClear && tableSearchInput) {
            tableSearchClear.addEventListener("click", () => {
                tableSearchInput.value = "";
                applyTableFilter();
                tableSearchInput.focus();
            });
        }
        if (branchSearchInput) {
            branchSearchInput.addEventListener("input", () => {
                if (branchSearchWrap) branchSearchWrap.classList.toggle("has-value", branchSearchInput.value.length > 0);
                renderBranches();
            });
            branchSearchInput.addEventListener("focus", () => branchSearchWrap?.classList.add("is-open"));
            branchSearchInput.addEventListener("blur", () => branchSearchWrap?.classList.remove("is-open"));
        }
        if (branchSearchClear && branchSearchInput) {
            branchSearchClear.addEventListener("click", () => {
                branchSearchInput.value = "";
                if (branchSearchWrap) branchSearchWrap.classList.remove("has-value");
                renderBranches();
                branchSearchInput.focus();
            });
        }
        if (tableSelectModalClose) {
            tableSelectModalClose.addEventListener("click", () => {
                closeModal(tableModal);
            });
        }
        if (selectionStatusBtn) {
            selectionStatusBtn.addEventListener("click", () => {
                const selectionType = localStorage.getItem(
                    STORAGE_KEYS.branchSelectionType,
                );
                // QR ile gelmişse şube seçim modalını açma, direkt order type modalını aç
                if (selectionType === "qr") {
                    updateSelectionStatus();
                    openOrderTypeModal();
                } else {
                    // Manuel gelmişse normal akış
                    updateSelectionStatus();
                    openOrderTypeModal();
                }
            });
        }

        // Call Waiter Button Event
        const callWaiterBtn = document.getElementById("callWaiterBtn");
        if (callWaiterBtn) {
            callWaiterBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCallWaiter();
            });
        } else {
            console.warn("callWaiterBtn bulunamadı");
        }

        window.addEventListener("languageChanged", () => {
            updateSelectionStatus();
        });

        renderBranches();
        renderOrderTypes();
        updateSelectionStatus();

        // Order type modal close butonunu kontrol et
        const orderTypeModalClose = document.getElementById("orderTypeModalClose");
        const hasStoredSelection = Boolean(
            localStorage.getItem(STORAGE_KEYS.branchId) &&
            localStorage.getItem(STORAGE_KEYS.orderType),
        );

        if (orderTypeModalClose) {
            orderTypeModalClose.style.display = hasStoredSelection ? "flex" : "none";
            orderTypeModalClose.addEventListener("click", () => {
                closeModal(orderModal);
            });
        }

        if (!selectedBranchId && isMultiBranch) {
            const selectionType = localStorage.getItem(
                STORAGE_KEYS.branchSelectionType,
            );
            // QR ile gelmişse şube seçim modalını açma
            if (selectionType !== "qr") {
                if (branchSearchInput) { branchSearchInput.value = ""; if (branchSearchWrap) branchSearchWrap.classList.remove("has-value"); }
                openModal(branchModal);
                return;
            }
        }

        if (!selectedOrderType) {
            const currentBranch = getCurrentBranch();
            const enabledTypes = Object.entries(orderTypeLabels).filter(
                ([key]) => currentBranch?.orderTypes?.[key],
            );
            if (enabledTypes.length === 1 && isMultiBranch) {
                selectedOrderType = enabledTypes[0][0];
                localStorage.setItem(STORAGE_KEYS.orderType, selectedOrderType);
                if (selectedOrderType === "tableOrder") {
                    openModal(tableModal);
                    loadTablesForBranch();
                } else {
                    updateSelectionStatus();
                    emitSelectionChanged();
                }
            } else {
                openOrderTypeModal();
            }
        } else {
            if (selectedOrderType === "tableOrder") {
                const storedTableId = localStorage.getItem(STORAGE_KEYS.tableId);
                const tableId = urlTableId || storedTableId;
                if (!tableId) {
                    openModal(tableModal);
                    loadTablesForBranch();
                    return;
                }
            }
            updateSelectionStatus();
            emitSelectionChanged();
        }

        // Expose functions for inline onclick
        if (!window.menuPage) {
            window.menuPage = {};
        }
        window.menuPage.openQrScanner = startQrScanner;
        window.menuPage.handleCallWaiter = handleCallWaiter;
    }

    function bootSelection() {
        if (window.HeaderData) {
            initSelectionFlow(window.HeaderData);
        }
    }

    document.addEventListener("headerDataLoaded", (event) => {
        initSelectionFlow(event.detail);
    });

    document.addEventListener("DOMContentLoaded", () => {
        bootSelection();
    });
})();

// ========== PRODUCT GALLERY SYSTEM ==========
(function () {
    let currentGalleryIndex = 0;
    let currentMediaList = [];
    let fullscreenMode = false;

    const gallerySlides = document.getElementById("gallerySlides");
    const galleryDots = document.getElementById("galleryDots");
    const galleryPrev = document.getElementById("galleryPrev");
    const galleryNext = document.getElementById("galleryNext");
    const galleryFullscreen = document.getElementById("galleryFullscreen");
    const galleryFullscreenContent = document.getElementById(
        "galleryFullscreenContent",
    );
    const galleryFullscreenClose = document.getElementById(
        "galleryFullscreenClose",
    );
    const fullscreenPrev = document.getElementById("fullscreenPrev");
    const fullscreenNext = document.getElementById("fullscreenNext");
    const fullscreenDots = document.getElementById("fullscreenDots");

    window.initProductGallery = function (media) {
        const spinner = document.getElementById("modalImageLoadingSpinner");
        const gallerySlides = document.getElementById("gallerySlides");

        if (!media || !Array.isArray(media) || media.length === 0) {
            // Eski tek resim sistemi - spinner'ı gizle
            if (spinner) {
                spinner.style.display = "none";
            }
            if (gallerySlides) {
                gallerySlides.style.display = "none";
            }
            return;
        }

        // Gallery'yi görünür yap
        if (gallerySlides) {
            gallerySlides.style.display = "flex";
        }

        // Spinner'ı göster
        if (spinner) {
            spinner.style.display = "flex";
        }

        currentMediaList = media;
        currentGalleryIndex = 0;
        renderGallery();
        renderDots();
        updateNavButtons();

        // Tek item kontrolü - navigation elemanlarını gizle/göster
        const isSingleItem = media.length === 1;

        if (galleryPrev) {
            galleryPrev.classList.toggle("single-item", isSingleItem);
        }
        if (galleryNext) {
            galleryNext.classList.toggle("single-item", isSingleItem);
        }
        if (galleryDots) {
            galleryDots.classList.toggle("single-item", isSingleItem);
        }
    };

    function renderGallery() {
        if (!gallerySlides) return;

        gallerySlides.innerHTML = "";
        const spinner = document.getElementById("modalImageLoadingSpinner");

        // Spinner'ı göster
        if (spinner) {
            spinner.style.display = "flex";
        }

        // Gallery slides'i görünür yap
        if (gallerySlides) {
            gallerySlides.style.display = "flex";
        }

        let imagesToLoad = 0;
        let imagesLoaded = 0;
        let firstImageLoaded = false;

        currentMediaList.forEach((item, index) => {
            const slide = document.createElement("div");
            slide.className = "gallery-slide";

            if (item.type === "video") {
                slide.innerHTML = `
          <video id="galleryVideo${index}" ${item.poster ? `poster="${item.poster}"` : ""
                    }>
            <source src="${item.url}" type="video/mp4">
          </video>
          <div class="gallery-video-overlay" data-index="${index}">
            <button class="gallery-play-btn">
              <i class="fas fa-play"></i>
            </button>
          </div>
        `;

                const overlay = slide.querySelector(".gallery-video-overlay");
                const video = slide.querySelector("video");

                overlay.addEventListener("click", () => {
                    video.play();
                    overlay.classList.add("playing");
                });

                video.addEventListener("pause", () => {
                    overlay.classList.remove("playing");
                });

                video.addEventListener("ended", () => {
                    overlay.classList.remove("playing");
                });

                // Video için poster varsa yükleme sayısına ekle
                if (item.poster) {
                    imagesToLoad++;
                    const posterImg = new Image();
                    posterImg.onload = () => {
                        imagesLoaded++;
                        if (!firstImageLoaded && index === 0) {
                            firstImageLoaded = true;
                            if (spinner) {
                                spinner.style.display = "none";
                            }
                        }
                        checkAllLoaded();
                    };
                    posterImg.onerror = () => {
                        imagesLoaded++;
                        if (!firstImageLoaded && index === 0) {
                            firstImageLoaded = true;
                            if (spinner) {
                                spinner.style.display = "none";
                            }
                        }
                        checkAllLoaded();
                    };
                    posterImg.src = item.poster;
                } else {
                    // Video yüklendiğinde say
                    video.addEventListener("loadedmetadata", () => {
                        imagesLoaded++;
                        if (!firstImageLoaded && index === 0) {
                            firstImageLoaded = true;
                            if (spinner) {
                                spinner.style.display = "none";
                            }
                        }
                        checkAllLoaded();
                    });
                }
            } else {
                imagesToLoad++;
                slide.innerHTML = `<img alt="Product image ${index + 1}">`;
                const img = slide.querySelector("img");
                if (item.isLogoFallback) {
                    img.classList.add("logo-fallback-image");
                }

                // Resme tıklayınca fullscreen aç - sadece drag yoksa
                slide.style.cursor = "pointer";
                slide.addEventListener("click", (e) => {
                    // Hareket yoksa fullscreen aç
                    if (!hasMoved) {
                        openFullscreen(index);
                    }
                });

                // Attach event handlers before setting src
                img.onload = () => {
                    imagesLoaded++;
                    // İlk resim yüklendiğinde spinner'ı gizle
                    if (!firstImageLoaded && index === 0) {
                        firstImageLoaded = true;
                        if (spinner) {
                            spinner.style.display = "none";
                        }
                    }
                    checkAllLoaded();
                };

                img.onerror = () => {
                    imagesLoaded++;
                    // İlk resim yüklenemese bile spinner'ı gizle
                    if (!firstImageLoaded && index === 0) {
                        firstImageLoaded = true;
                        if (spinner) {
                            spinner.style.display = "none";
                        }
                    }
                    checkAllLoaded();
                };

                // Set src after attaching event handlers
                img.src = item.url;

                // Check if image is already loaded (cached) - immediately after setting src
                if (img.complete && img.naturalHeight !== 0) {
                    // Image is already loaded from cache, trigger load handler immediately
                    img.onload();
                }
            }

            gallerySlides.appendChild(slide);
        });

        // After all slides are added, check if all images are already loaded (cached)
        // This ensures spinner is hidden even if onload events didn't fire
        setTimeout(() => {
            const allImages = gallerySlides.querySelectorAll("img");
            let allComplete = true;

            if (allImages.length > 0) {
                allImages.forEach((img) => {
                    if (!img.complete || img.naturalHeight === 0) {
                        allComplete = false;
                    }
                });

                if (allComplete && spinner && spinner.style.display !== "none") {
                    // All images are already loaded, hide spinner
                    spinner.style.display = "none";
                }
            }
        }, 50);

        // Tüm medya yüklendiğinde kontrol (backup)
        function checkAllLoaded() {
            if (
                imagesLoaded >= imagesToLoad ||
                imagesLoaded >= currentMediaList.length
            ) {
                // Always hide spinner if all images are loaded
                if (spinner) {
                    spinner.style.display = "none";
                }
            }
        }

        // Eğer hiç resim yoksa direkt gizle
        if (imagesToLoad === 0 && currentMediaList.length > 0) {
            setTimeout(() => {
                if (spinner) {
                    spinner.style.display = "none";
                }
            }, 500);
        }

        // Fallback: 3 saniye sonra spinner'ı gizle
        setTimeout(() => {
            if (spinner && spinner.style.display !== "none") {
                spinner.style.display = "none";
            }
        }, 3000);

        updateSlidePosition();
    }

    function renderDots() {
        if (!galleryDots) return;

        galleryDots.innerHTML = "";

        currentMediaList.forEach((_, index) => {
            const dot = document.createElement("button");
            dot.className = "gallery-dot";
            dot.type = "button";
            if (index === currentGalleryIndex) {
                dot.classList.add("active");
            }
            dot.addEventListener("click", () => goToSlide(index));
            galleryDots.appendChild(dot);
        });
    }

    function updateDots() {
        if (!galleryDots) return;

        const dots = galleryDots.querySelectorAll(".gallery-dot");
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentGalleryIndex);
        });
    }

    function updateSlidePosition() {
        if (!gallerySlides) return;

        const offset = -currentGalleryIndex * 100;
        gallerySlides.style.transform = `translateX(${offset}%)`;
    }

    function updateNavButtons() {
        if (galleryPrev) {
            galleryPrev.disabled = currentGalleryIndex === 0;
        }
        if (galleryNext) {
            galleryNext.disabled =
                currentGalleryIndex === currentMediaList.length - 1;
        }
    }

    function goToSlide(index) {
        if (index < 0 || index >= currentMediaList.length) return;

        // Pause all videos
        document.querySelectorAll(".gallery-slide video").forEach((video) => {
            video.pause();
        });

        currentGalleryIndex = index;
        updateSlidePosition();
        updateDots();
        updateNavButtons();
    }

    function nextSlide() {
        if (currentGalleryIndex < currentMediaList.length - 1) {
            goToSlide(currentGalleryIndex + 1);
        }
    }

    function prevSlide() {
        if (currentGalleryIndex > 0) {
            goToSlide(currentGalleryIndex - 1);
        }
    }

    function openFullscreen(index) {
        if (!galleryFullscreen || !galleryFullscreenContent) return;

        fullscreenMode = true;
        currentGalleryIndex = index;

        const item = currentMediaList[index];

        if (item.type === "video") {
            galleryFullscreenContent.innerHTML = `
        <video controls autoplay ${item.poster ? `poster="${item.poster}"` : ""
                }>
          <source src="${item.url}" type="video/mp4">
        </video>
      `;
        } else {
            galleryFullscreenContent.innerHTML = `<img src="${item.url}" alt="Product image">`;
        }

        renderFullscreenDots();
        updateFullscreenNavButtons();

        // Tek item kontrolü - fullscreen navigation elemanlarını gizle/göster
        const isSingleItem = currentMediaList.length === 1;

        if (fullscreenPrev) {
            fullscreenPrev.classList.toggle("single-item", isSingleItem);
        }
        if (fullscreenNext) {
            fullscreenNext.classList.toggle("single-item", isSingleItem);
        }
        if (fullscreenDots) {
            fullscreenDots.classList.toggle("single-item", isSingleItem);
        }

        galleryFullscreen.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeFullscreen() {
        if (!galleryFullscreen) return;

        fullscreenMode = false;
        galleryFullscreen.classList.remove("active");
        document.body.style.overflow = "";

        // Stop video
        const video = galleryFullscreenContent.querySelector("video");
        if (video) {
            video.pause();
        }
    }

    function renderFullscreenDots() {
        if (!fullscreenDots) return;

        fullscreenDots.innerHTML = "";

        currentMediaList.forEach((_, index) => {
            const dot = document.createElement("button");
            dot.className = "gallery-fullscreen-dot";
            dot.type = "button";
            if (index === currentGalleryIndex) {
                dot.classList.add("active");
            }
            dot.addEventListener("click", () => goToFullscreenSlide(index));
            fullscreenDots.appendChild(dot);
        });
    }

    function updateFullscreenDots() {
        if (!fullscreenDots) return;

        const dots = fullscreenDots.querySelectorAll(".gallery-fullscreen-dot");
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentGalleryIndex);
        });
    }

    function updateFullscreenNavButtons() {
        if (fullscreenPrev) {
            fullscreenPrev.disabled = currentGalleryIndex === 0;
        }
        if (fullscreenNext) {
            fullscreenNext.disabled =
                currentGalleryIndex === currentMediaList.length - 1;
        }
    }

    function goToFullscreenSlide(index) {
        if (index < 0 || index >= currentMediaList.length) return;

        currentGalleryIndex = index;
        const item = currentMediaList[index];

        if (item.type === "video") {
            galleryFullscreenContent.innerHTML = `
        <video controls autoplay ${item.poster ? `poster="${item.poster}"` : ""
                }>
          <source src="${item.url}" type="video/mp4">
        </video>
      `;
        } else {
            galleryFullscreenContent.innerHTML = `<img src="${item.url}" alt="Product image">`;
        }

        updateFullscreenDots();
        updateFullscreenNavButtons();
    }

    function nextFullscreenSlide() {
        if (currentGalleryIndex < currentMediaList.length - 1) {
            goToFullscreenSlide(currentGalleryIndex + 1);
        }
    }

    function prevFullscreenSlide() {
        if (currentGalleryIndex > 0) {
            goToFullscreenSlide(currentGalleryIndex - 1);
        }
    }

    // Event Listeners
    if (galleryPrev) {
        galleryPrev.addEventListener("click", prevSlide);
    }

    if (galleryNext) {
        galleryNext.addEventListener("click", nextSlide);
    }

    if (galleryFullscreenClose) {
        galleryFullscreenClose.addEventListener("click", closeFullscreen);
    }

    if (fullscreenPrev) {
        fullscreenPrev.addEventListener("click", prevFullscreenSlide);
    }

    if (fullscreenNext) {
        fullscreenNext.addEventListener("click", nextFullscreenSlide);
    }

    // Close fullscreen on Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && fullscreenMode) {
            closeFullscreen();
        }
    });

    // Arrow keys for navigation
    document.addEventListener("keydown", (e) => {
        if (!fullscreenMode) return;

        if (e.key === "ArrowLeft") {
            prevFullscreenSlide();
        } else if (e.key === "ArrowRight") {
            nextFullscreenSlide();
        }
    });

    // ========== SWIPE/DRAG SUPPORT ==========

    // Normal gallery swipe support
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let hasMoved = false; // Hareket var mı kontrolü
    let startTransform = 0;

    if (gallerySlides) {
        gallerySlides.addEventListener("mousedown", handleDragStart);
        gallerySlides.addEventListener("touchstart", handleDragStart, {
            passive: true,
        });

        document.addEventListener("mousemove", handleDragMove);
        document.addEventListener("touchmove", handleDragMove, { passive: false });

        document.addEventListener("mouseup", handleDragEnd);
        document.addEventListener("touchend", handleDragEnd);
    }

    function handleDragStart(e) {
        if (fullscreenMode) return;

        isDragging = true;
        hasMoved = false; // Reset
        startX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
        currentX = startX;

        const currentTransform = window.getComputedStyle(gallerySlides).transform;
        if (currentTransform && currentTransform !== "none") {
            const matrix = currentTransform.match(/matrix.*\((.+)\)/);
            if (matrix) {
                startTransform = parseFloat(matrix[1].split(", ")[4]) || 0;
            }
        } else {
            startTransform = -currentGalleryIndex * gallerySlides.offsetWidth;
        }

        gallerySlides.classList.add("dragging");
        gallerySlides.style.transition = "none";
    }

    function handleDragMove(e) {
        if (!isDragging || fullscreenMode) return;

        e.preventDefault();
        currentX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
        const diff = currentX - startX;

        // 5px'den fazla hareket varsa işaretle
        if (Math.abs(diff) > 5) {
            hasMoved = true;
        }

        gallerySlides.style.transform = `translateX(${startTransform + diff}px)`;
    }

    function handleDragEnd(e) {
        if (!isDragging || fullscreenMode) return;

        isDragging = false;
        gallerySlides.classList.remove("dragging");
        gallerySlides.style.transition = "";

        const diff = currentX - startX;
        const threshold = gallerySlides.offsetWidth * 0.2; // 20% kaydırma yeterli

        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentGalleryIndex > 0) {
                // Sola kaydır (önceki)
                prevSlide();
            } else if (
                diff < 0 &&
                currentGalleryIndex < currentMediaList.length - 1
            ) {
                // Sağa kaydır (sonraki)
                nextSlide();
            } else {
                // Geri dön
                updateSlidePosition();
            }
        } else {
            // Geri dön
            updateSlidePosition();
        }

        // hasMoved'i biraz sonra sıfırla (click event'inden sonra)
        setTimeout(() => {
            hasMoved = false;
        }, 100);
    }

    // Fullscreen swipe support (horizontal + vertical to close)
    let fsStartX = 0;
    let fsStartY = 0;
    let fsCurrentX = 0;
    let fsCurrentY = 0;
    let fsIsDragging = false;

    if (galleryFullscreenContent) {
        galleryFullscreenContent.addEventListener("mousedown", handleFsDragStart);
        galleryFullscreenContent.addEventListener("touchstart", handleFsDragStart, {
            passive: true,
        });

        document.addEventListener("mousemove", handleFsDragMove);
        document.addEventListener("touchmove", handleFsDragMove, {
            passive: false,
        });

        document.addEventListener("mouseup", handleFsDragEnd);
        document.addEventListener("touchend", handleFsDragEnd);
    }

    function handleFsDragStart(e) {
        if (!fullscreenMode) return;

        fsIsDragging = true;
        fsStartX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
        fsStartY = e.type.includes("mouse") ? e.pageY : e.touches[0].pageY;
        fsCurrentX = fsStartX;
        fsCurrentY = fsStartY;

        galleryFullscreenContent.classList.add("dragging");
    }

    function handleFsDragMove(e) {
        if (!fsIsDragging || !fullscreenMode) return;

        fsCurrentX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
        fsCurrentY = e.type.includes("mouse") ? e.pageY : e.touches[0].pageY;

        // Vertical swipe için opacity azalt
        const diffY = Math.abs(fsCurrentY - fsStartY);
        if (diffY > 20 && galleryFullscreen) {
            const opacity = Math.max(0.3, 1 - diffY / 300);
            galleryFullscreen.style.opacity = opacity;
        }
    }

    function handleFsDragEnd(e) {
        if (!fsIsDragging || !fullscreenMode) return;

        fsIsDragging = false;
        galleryFullscreenContent.classList.remove("dragging");

        const diffX = fsCurrentX - fsStartX;
        const diffY = fsCurrentY - fsStartY;
        const thresholdX = 50; // 50px yatay kaydırma
        const thresholdY = 80; // 80px dikey kaydırma

        // Önce vertical swipe kontrolü - kapatma için
        if (Math.abs(diffY) > thresholdY && Math.abs(diffY) > Math.abs(diffX)) {
            // Dikey hareket baskın - kapat
            closeFullscreen();
            if (galleryFullscreen) {
                galleryFullscreen.style.opacity = ""; // Opacity'yi sıfırla
            }
            return;
        }

        // Horizontal swipe - slide değiştirme
        if (Math.abs(diffX) > thresholdX && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0 && currentGalleryIndex > 0) {
                // Sola kaydır (önceki)
                prevFullscreenSlide();
            } else if (
                diffX < 0 &&
                currentGalleryIndex < currentMediaList.length - 1
            ) {
                // Sağa kaydır (sonraki)
                nextFullscreenSlide();
            }
        }

        // Opacity'yi geri yükle
        if (galleryFullscreen) {
            galleryFullscreen.style.opacity = "";
        }
    }
})();

// ========== CATEGORIES LOADER ==========

(function () {
    'use strict';

    function getSelectionParams() {
        const branchId = localStorage.getItem('menuBranchId');
        const orderType = localStorage.getItem('menuOrderType');
        const lang = getAjaxLang();

        const params = new URLSearchParams();
        params.set('lang', lang);
        if (branchId) params.set('branch_id', branchId);
        if (orderType) params.set('order_type', orderType);

        return params.toString();
    }

    async function loadCategories() {
        try {
            const provider = window.TahmisciPublicData;
            if (!provider) throw new Error('Public veri sağlayıcısı bulunamadı.');
            await provider.ready;
            const categories = provider.getCategories();
            window.MenuCategories = categories;
            renderCategories(categories);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    function renderCategories(categories) {
        const filterCategoriesContainer = document.querySelector('.filter-categories');
        if (!filterCategoriesContainer) return;

        const subWrapper = document.querySelector('.filter-subcategories-wrapper');
        const subContainer = document.querySelector('.filter-subcategories');
        if (subWrapper) {
            subWrapper.style.display = 'none';
            document.querySelector(".menu-filters-sticky")?.classList.remove("subcategories-visible");
        }

        filterCategoriesContainer.innerHTML = '';
        const inner = document.createElement('div');
        inner.className = 'filter-categories-inner';

        categories.forEach((category) => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.setAttribute('data-category', String(category.id));
            button.innerHTML = `
                <i class="${category.icon}"></i>
                ${category.name}
            `;

            if (String(category.id) === 'all') {
                button.classList.add('active');
            }

            inner.appendChild(button);
        });

        filterCategoriesContainer.appendChild(inner);

        // İlk kategori alt kategori içeriyorsa, kullanıcı tıklamadan alt kategori şeridini de render et.
        const firstCategory = Array.isArray(categories) && categories.length > 0 ? categories[0] : null;
        if (
            !window.TahmisciCatalog &&
            firstCategory &&
            Array.isArray(firstCategory.subcategories) &&
            firstCategory.subcategories.length > 0 &&
            subWrapper &&
            subContainer
        ) {
            subWrapper.style.display = '';
            document.querySelector(".menu-filters-sticky")?.classList.add("subcategories-visible");
            subContainer.innerHTML = '';
            const subInner = document.createElement('div');
            subInner.className = 'filter-subcategories-inner';
            firstCategory.subcategories.forEach((sub) => {
                const subBtn = document.createElement('button');
                subBtn.className = 'filter-btn filter-sub-btn';
                subBtn.setAttribute('data-category', String(sub.id));
                subBtn.innerHTML = sub.icon ? `<i class="${sub.icon}"></i> ${sub.name}` : sub.name;
                subInner.appendChild(subBtn);
            });
            subContainer.appendChild(subInner);
        }

        // Dispatch event for menu.js to initialize filters
        document.dispatchEvent(new CustomEvent('categoriesLoaded', {
            detail: { categories }
        }));
    }

    // Load categories when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadCategories);
    } else {
        loadCategories();
    }

    document.addEventListener('menuSelectionChanged', loadCategories);
    window.addEventListener('languageChanged', loadCategories);
    window.addEventListener('publicBootstrapUpdated', loadCategories);
})();

// ========== DRAG TO SCROLL (filter-categories & filter-subcategories) - sadece masaüstü ==========
(function () {
    var activeContainer = null;
    var startX = 0;
    var scrollStart = 0;
    var moved = false;
    var boundDocMove = false;
    var dragMultiplier = 2;
    var pendingScrollLeft = 0;
    var rafScheduled = false;
    var savedScrollBehavior = '';

    function isDesktop() {
        return window.innerWidth > 768;
    }

    function applyScroll() {
        rafScheduled = false;
        if (activeContainer) activeContainer.scrollLeft = pendingScrollLeft;
    }

    function onDocMove(e) {
        if (!activeContainer) return;
        e.preventDefault();
        var x = e.pageX;
        var walk = (startX - x) * dragMultiplier;
        if (Math.abs(walk) > 2) moved = true;
        pendingScrollLeft = scrollStart + walk;
        if (!rafScheduled) {
            rafScheduled = true;
            requestAnimationFrame(applyScroll);
        }
    }
    function onDocEnd() {
        if (!activeContainer) return;
        var el = activeContainer;
        el.style.cursor = 'grab';
        el.style.scrollBehavior = savedScrollBehavior || '';
        activeContainer = null;
        rafScheduled = false;
        if (moved) {
            el.dataset.dragJustEnded = '1';
            setTimeout(function () { delete el.dataset.dragJustEnded; }, 0);
        }
    }

    function setupDragToScroll(container) {
        if (!container || container._dragScrollSetup || !isDesktop()) return;
        container._dragScrollSetup = true;
        container.style.cursor = 'grab';
        container.style.userSelect = 'none';

        if (!boundDocMove) {
            boundDocMove = true;
            document.addEventListener('mousemove', onDocMove, true);
            document.addEventListener('mouseup', onDocEnd, true);
        }

        function start(e) {
            if (e.type.indexOf('touch') === 0) return;
            e.preventDefault();
            activeContainer = container;
            moved = false;
            savedScrollBehavior = container.style.scrollBehavior || '';
            container.style.scrollBehavior = 'auto';
            container.style.cursor = 'grabbing';
            startX = e.pageX;
            scrollStart = container.scrollLeft;
            pendingScrollLeft = scrollStart;
        }
        function end() {
            if (activeContainer === container) onDocEnd();
        }

        container.addEventListener('mousedown', start, true);
        container.addEventListener('mouseleave', end);
    }

    function initDragScroll() {
        if (!isDesktop()) return;
        var cat = document.querySelector('.filter-categories');
        var sub = document.querySelector('.filter-subcategories');
        if (cat) setupDragToScroll(cat);
        if (sub) setupDragToScroll(sub);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDragScroll);
    } else {
        initDragScroll();
    }
    document.addEventListener('categoriesLoaded', initDragScroll);
})();

// ========== TAHMİSÇİ COMPACT STICKY FILTER ==========
(function () {
    let forceHideFilter = false;
    let forceHideTimer = null;

    function updateHeaderHeight() {
        if (!document.body.classList.contains('tahmisci-static-menu')) return;
        const header = document.getElementById('header') || document.querySelector('.modern-header, .header');
        const height = Math.ceil(header?.getBoundingClientRect().height || 76);
        document.documentElement.style.setProperty('--tahmisci-header-height', `${height}px`);
    }

    function updateActiveSectionNav(headerHeight) {
        const sectionIds = ['top', 'menu', 'about', 'qr-menu', 'contact'];
        const probe = (headerHeight || 76) + 18;
        let activeId = 'top';

        sectionIds.forEach((id) => {
            const el = id === 'top' ? document.body : document.getElementById(id);
            if (!el) return;
            const rect = el.getBoundingClientRect();
            if (rect.top <= probe && rect.bottom > probe) {
                activeId = id;
            }
        });

        document.querySelectorAll('.nav-link[href^="#"], .mobile-nav-link[href^="#"]').forEach((link) => {
            const target = (link.getAttribute('href') || '').replace('#', '') || 'top';
            link.classList.toggle('active', target === activeId);
        });
    }

    function updateCompactFilter() {
        if (!document.body.classList.contains('tahmisci-static-menu')) return;
        updateHeaderHeight();
        const filters = document.getElementById('menuFilters');
        const menu = document.getElementById('menu');
        if (!filters || !menu) return;

        const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tahmisci-header-height')) || 76;
        const menuRect = menu.getBoundingClientRect();
        const filterHeight = filters.offsetHeight || 0;
        document.documentElement.style.setProperty('--tahmisci-filter-height', `${Math.ceil(filterHeight)}px`);

        const activationLine = Math.min(window.innerHeight * 0.45, headerHeight + 180);
        const nextSectionReached = ['about', 'qr-menu', 'contact'].some((id) => {
            const section = document.getElementById(id);
            return section && section.getBoundingClientRect().top <= activationLine;
        });
        const isMenuActive =
            !forceHideFilter &&
            !nextSectionReached &&
            menuRect.top <= activationLine &&
            menuRect.bottom > headerHeight + Math.max(filterHeight, 56);

        filters.classList.toggle('is-menu-active', isMenuActive);
        filters.classList.toggle('is-compact-sticky', isMenuActive && menuRect.top < headerHeight);
        document.body.classList.toggle('menu-filter-active', isMenuActive);
        updateActiveSectionNav(headerHeight);
    }

    function bindFilterNavVisibility() {
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href^="#"]');
            if (!link) return;
            const target = link.hash || link.getAttribute('href');
            const filters = document.getElementById('menuFilters');
            if (target !== '#menu') {
                forceHideFilter = true;
                filters?.setAttribute('data-force-hidden', '1');
                filters?.classList.remove('is-menu-active', 'is-compact-sticky');
                document.body.classList.remove('menu-filter-active');
                clearTimeout(forceHideTimer);
                forceHideTimer = setTimeout(() => {
                    forceHideFilter = false;
                    filters?.removeAttribute('data-force-hidden');
                    updateCompactFilter();
                }, 1200);
            } else {
                forceHideFilter = false;
                filters?.removeAttribute('data-force-hidden');
                clearTimeout(forceHideTimer);
                setTimeout(updateCompactFilter, 80);
            }
        }, true);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            updateHeaderHeight();
            bindFilterNavVisibility();
            updateCompactFilter();
        });
    } else {
        updateHeaderHeight();
        bindFilterNavVisibility();
        updateCompactFilter();
    }
    window.addEventListener('scroll', updateCompactFilter, { passive: true });
    window.addEventListener('resize', () => {
        updateHeaderHeight();
        updateCompactFilter();
    });
    document.addEventListener('productsRendered', updateCompactFilter);
    document.addEventListener('categoriesLoaded', updateCompactFilter);
})();

// ========== MENU PRODUCTS LOADER ==========

(function () {
    'use strict';

    /** Seçili kategori id (0 = tümü, sadece alt kategorisi olan ana kategoriye tıklanınca set edilir) */
    let currentCategoryId = 0;
    let currentMenuSearchTerm = "";
    let currentMenuView = "categories";
    let cachedMenuProducts = [];
    let cachedProductsByCategory = {};

    function menuText(key, fallback) {
        return window.I18N?.t?.(key) || fallback;
    }

    function normalizeMenuText(value) {
        return String(value || "")
            .toLocaleLowerCase("tr-TR")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/ı/g, "i")
            .replace(/[^a-z0-9]+/g, " ")
            .trim();
    }

    function buildProductSearchText(product) {
        const parts = [
            product?.name,
            product?.categoryName,
            product?.parentCategoryName,
            product?.description,
            product?.content,
            product?.ingredients,
            product?.products_branches_calories,
            ...(Array.isArray(product?.variants) ? product.variants.map((variant) => variant?.name) : [])
        ];
        return normalizeMenuText(parts.filter(Boolean).join(" "));
    }

    function updateCategoryTitleVisibility() {
        const grid = document.getElementById("productsGrid");
        if (!grid) return;
        const children = Array.from(grid.children);
        children.forEach((node, index) => {
            if (!node.classList?.contains("category-title")) return;
            let hasVisibleProduct = false;
            for (let i = index + 1; i < children.length; i += 1) {
                const item = children[i];
                if (item.classList?.contains("category-title")) break;
                if (item.classList?.contains("product-card") && item.style.display !== "none") {
                    hasVisibleProduct = true;
                    break;
                }
            }
            node.style.display = hasVisibleProduct ? "" : "none";
        });
    }

    function applyMenuSearch() {
        const searchNeedle = normalizeMenuText(currentMenuSearchTerm);
        const cards = document.querySelectorAll("#productsGrid .product-card");
        const categoryCards = document.querySelectorAll("#productsGrid .menu-category-card");
        let visibleCount = 0;

        if (categoryCards.length && cards.length === 0) {
            categoryCards.forEach((card) => {
                const haystack = card.dataset.search || normalizeMenuText(card.textContent);
                const visible = !searchNeedle || haystack.includes(searchNeedle);
                card.style.display = visible ? "flex" : "none";
                if (visible) visibleCount += 1;
            });
            const emptyState = document.getElementById("emptyState");
            if (emptyState) {
                emptyState.style.display = visibleCount === 0 ? "block" : "none";
            }
            return;
        }

        cards.forEach((card) => {
            const haystack = card.dataset.search || normalizeMenuText(card.textContent);
            const visible = !searchNeedle || haystack.includes(searchNeedle);
            card.style.display = visible ? "flex" : "none";
            if (visible) visibleCount += 1;
        });

        updateCategoryTitleVisibility();
        const emptyState = document.getElementById("emptyState");
        if (emptyState) {
            emptyState.style.display = visibleCount === 0 ? "block" : "none";
        }
    }

    function initMenuSearch() {
        const searchInput = document.getElementById("productSearch");
        if (!searchInput || searchInput.dataset.tahmisciSearchBound === "1") return;
        searchInput.dataset.tahmisciSearchBound = "1";
        searchInput.addEventListener("input", (event) => {
            currentMenuSearchTerm = event.target.value || "";
            if (cachedMenuProducts.length && currentMenuView === "categories" && currentMenuSearchTerm) {
                renderCategoryProducts(0, { searchMode: true });
                return;
            }
            if (cachedMenuProducts.length && currentMenuView === "search" && !currentMenuSearchTerm) {
                renderCategoryCards();
                return;
            }
            applyMenuSearch();
        });
    }

    function getSelectionParams() {
        const branchId = localStorage.getItem('menuBranchId');
        const orderType = localStorage.getItem('menuOrderType');
        const lang = getAjaxLang();

        const params = new URLSearchParams();
        if (branchId) params.set('branch_id', branchId);
        if (orderType) params.set('order_type', orderType);
        if (lang) params.set('lang', lang);
        params.set('include_subcategories', '1');

        return params.toString();
    }

    /** Sadece alt kategorisi olan ana kategori seçildiğinde çağrılır; id=0 veya '' = tüm ürünler. */
    window.loadMenuProductsForCategory = function (id) {
        currentCategoryId = normalizeCategoryId(id);
        if (cachedMenuProducts.length) {
            if (currentCategoryId > 0) {
                renderCategoryProducts(currentCategoryId);
            } else if (currentMenuSearchTerm) {
                renderCategoryProducts(0, { searchMode: true });
            } else {
                renderCategoryCards();
            }
            return;
        }
        loadMenuProducts();
    };

    let _menuProductsLoading = false;

    async function loadMenuProducts() {
        if (_menuProductsLoading) return;
        _menuProductsLoading = true;
        const loadingState = document.getElementById('loadingState');
        if (loadingState) loadingState.style.display = 'block';

        try {
            const provider = window.TahmisciPublicData;
            if (!provider) throw new Error('Public veri sağlayıcısı bulunamadı.');
            await provider.ready;
            const products = provider.getProducts();
            window.APP_CONFIG.menu = window.APP_CONFIG.menu || {};
            window.APP_CONFIG.menu.products = products;
            window.MenuProducts = products;
            renderProducts(products);
            document.dispatchEvent(new CustomEvent('menuProductsLoaded', { detail: { products } }));
        } catch (error) {
            console.error('Error loading menu products:', error);
            if (loadingState) loadingState.style.display = 'none';
            const emptyState = document.getElementById('emptyState');
            if (emptyState) emptyState.style.display = 'block';
        } finally {
            _menuProductsLoading = false;
        }
    }

    function normalizeCategoryId(value) {
        const id = Number(value);
        return Number.isInteger(id) && id > 0 ? id : 0;
    }

    function getMainCategories() {
        return (window.MenuCategories || []).filter((cat) => cat && cat.id !== "all" && normalizeCategoryId(cat.id) > 0);
    }

    function buildProductsByCategory(products) {
        const productsByCategory = {};
        const validCategoryIds = new Set();
        getMainCategories().forEach((cat) => {
            const mainId = normalizeCategoryId(cat.id);
            if (mainId) validCategoryIds.add(mainId);
            (cat.subcategories || []).forEach((sub) => {
                const subId = normalizeCategoryId(sub && sub.id);
                if (subId) validCategoryIds.add(subId);
            });
        });

        products.forEach((product) => {
            const categoryId = normalizeCategoryId(product && product.category);
            if (!categoryId) return;
            if (validCategoryIds.size > 0 && !validCategoryIds.has(categoryId)) return;
            const categoryKey = String(categoryId);
            if (!productsByCategory[categoryKey]) productsByCategory[categoryKey] = [];
            productsByCategory[categoryKey].push(product);
        });

        return productsByCategory;
    }

    function getCategoryProducts(categoryId) {
        const id = normalizeCategoryId(categoryId);
        if (!id) return cachedMenuProducts;
        const mainCategory = getMainCategories().find((cat) => normalizeCategoryId(cat.id) === id);
        if (mainCategory) {
            const allowedIds = new Set([id, ...(mainCategory.subcategories || []).map((sub) => normalizeCategoryId(sub.id)).filter(Boolean)]);
            return cachedMenuProducts.filter((product) => {
                const parentId = normalizeCategoryId(product && product.parentCategory);
                const productCategoryId = normalizeCategoryId(product && product.category);
                return parentId ? parentId === id : allowedIds.has(productCategoryId);
            });
        }
        return cachedProductsByCategory[String(id)] || [];
    }

    function getCategorySearchText(category) {
        const parts = [category?.name, ...(category?.subcategories || []).map((sub) => sub?.name)];
        return normalizeMenuText(parts.filter(Boolean).join(" "));
    }

    function getCategoryPreviewImage(categoryId) {
        const product = getCategoryProducts(categoryId).find((item) => item && item.image);
        return product?.image || "assets/images/brand/favicon.png";
    }

    function syncFilterButton(categoryId) {
        const activeId = categoryId ? String(categoryId) : "all";
        document.querySelectorAll("#menu .filter-btn[data-category]").forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.category === activeId);
        });
    }

    function updateMenuSummary(categoryName, count) {
        const productsCount = document.getElementById("productsCount");
        const productsCategory = document.getElementById("productsCategory");
        if (productsCount) productsCount.textContent = `${count} ${menuText("product_unit", "ürün")}`;
        if (productsCategory) productsCategory.textContent = categoryName || "kategoriler";
    }

    function notifyProductsRendered() {
        setTimeout(() => {
            document.dispatchEvent(new CustomEvent('productsRendered'));
        }, 100);
    }

    function createCategoryCard(category) {
        const productCount = getCategoryProducts(category.id).length || Number(category.productCount) || 0;
        const card = document.createElement("button");
        card.type = "button";
        card.className = "menu-category-card";
        card.setAttribute("data-category", String(category.id));
        card.setAttribute("data-search", getCategorySearchText(category));
        card.innerHTML = `
            <span class="menu-category-card-media">
                <img src="${getCategoryPreviewImage(category.id)}" alt="${category.name || ''}">
                <span class="menu-category-card-icon">${category.icon ? `<i class="${category.icon}"></i>` : ''}</span>
            </span>
            <span class="menu-category-card-body">
                <span class="menu-category-card-name">${category.name || ''}</span>
                <span class="menu-category-card-count">${productCount} ${menuText("product_unit", "ürün")}</span>
            </span>
        `;
        card.addEventListener("click", () => {
            window.loadMenuProductsForCategory?.(normalizeCategoryId(category.id));
        });
        return card;
    }

    function renderCategoryCards() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;
        currentMenuView = "categories";
        currentCategoryId = 0;
        productsGrid.className = "products-grid is-category-panel";
        productsGrid.innerHTML = "";

        getMainCategories().forEach((category) => {
            productsGrid.appendChild(createCategoryCard(category));
        });

        updateMenuSummary(menuText("main_categories_label", "ana kategoriler"), getMainCategories().length);
        syncFilterButton(0);
        initMenuSearch();
        applyMenuSearch();
        notifyProductsRendered();
    }

    function renderCategoryProducts(categoryId, options = {}) {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;
        const searchMode = options.searchMode === true;
        const selectedId = normalizeCategoryId(categoryId);
        const products = selectedId > 0 ? getCategoryProducts(selectedId) : cachedMenuProducts;
        const title = searchMode ? menuText("search_results_title", "Arama Sonuçları") : (selectedId > 0 ? getCategoryName(selectedId) : menuText("all_products_title", "Tüm Ürünler"));

        currentMenuView = searchMode ? "search" : "products";
        if (!searchMode) currentCategoryId = selectedId;
        productsGrid.className = "products-grid is-product-panel";
        productsGrid.innerHTML = "";

        const toolbar = document.createElement("div");
        toolbar.className = "menu-product-panel-toolbar";
        toolbar.innerHTML = `
            <button type="button" class="menu-product-panel-back">
                <i class="fas fa-arrow-left"></i>
                <span>${menuText("categories_back", "Kategoriler")}</span>
            </button>
            <div class="menu-product-panel-title">
                <strong>${title}</strong>
                <span>${products.length} ${menuText("product_unit", "ürün")}</span>
            </div>
        `;
        toolbar.querySelector(".menu-product-panel-back")?.addEventListener("click", () => {
            const searchInput = document.getElementById("productSearch");
            if (searchInput) searchInput.value = "";
            currentMenuSearchTerm = "";
            renderCategoryCards();
        });
        productsGrid.appendChild(toolbar);

        updateMenuSummary(title.toLocaleLowerCase("tr-TR"), products.length);
        syncFilterButton(selectedId);

        if (products.length === 0) {
            const emptyState = document.getElementById('emptyState');
            if (emptyState) emptyState.style.display = 'block';
            notifyProductsRendered();
            return;
        }

        const emptyState = document.getElementById('emptyState');
        if (emptyState) emptyState.style.display = 'none';
        products.forEach((product) => {
            productsGrid.appendChild(createProductCard(product));
        });

        initLazyLoading();
        initMenuSearch();
        applyMenuSearch();
        notifyProductsRendered();
    }

    function renderProducts(products) {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        const loadingState = document.getElementById('loadingState');
        if (loadingState) loadingState.style.display = 'none';

        const emptyState = document.getElementById('emptyState');
        if (!products || products.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        if (emptyState) emptyState.style.display = 'none';

        cachedMenuProducts = products.slice();
        cachedProductsByCategory = buildProductsByCategory(cachedMenuProducts);

        if (currentCategoryId > 0) {
            renderCategoryProducts(currentCategoryId);
        } else if (currentMenuSearchTerm) {
            renderCategoryProducts(0, { searchMode: true });
        } else {
            renderCategoryCards();
        }
    }

    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('.lazy-image');
        if (lazyImages.length === 0) return;

        // Intersection Observer for lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const imageContainer = img.closest('.product-image');
                    const spinner = imageContainer?.querySelector('.image-loading-spinner');

                    // Show spinner if exists
                    if (spinner) {
                        spinner.style.display = 'flex';
                    }

                    // Load image
                    const imageSrc = img.getAttribute('data-src');
                    if (imageSrc) {
                        const tempImg = new Image();

                        tempImg.onload = () => {
                            img.src = imageSrc;
                            img.classList.add('loaded');
                            // Hide spinner after image loads
                            if (spinner) {
                                spinner.style.display = 'none';
                            }
                            observer.unobserve(img);
                        };

                        tempImg.onerror = () => {
                            // Hide spinner on error
                            if (spinner) {
                                spinner.style.display = 'none';
                            }
                            // Optionally set a placeholder image
                            img.src = "assets/images/brand/favicon.png";
                            observer.unobserve(img);
                        };

                        tempImg.src = imageSrc;
                    } else {
                        // No image source, hide spinner
                        if (spinner) {
                            spinner.style.display = 'none';
                        }
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px' // Start loading 50px before image enters viewport
        });

        // Observe all lazy images
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }

    function getCategoryName(categoryId) {
        const id = Number(categoryId);
        const menuCats = window.MenuCategories || [];
        for (const cat of menuCats) {
            if (cat.id === id) return cat.name;
            if (cat.subcategories) {
                const sub = cat.subcategories.find(s => s.id === id);
                if (sub) return sub.name;
            }
        }
        return String(categoryId);
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        if (product && product.image_source === 'company_logo') {
            card.classList.add('product-logo-fallback');
        }
        card.setAttribute('data-category', String(product.category));
        if (product.parentCategory) {
            card.setAttribute('data-parent-category', String(product.parentCategory));
        }
        card.setAttribute('data-product-id', product.id);
        card.setAttribute('data-search', buildProductSearchText(product));
        card.style.cursor = 'pointer';

        const badgeMap = {
            'popular': 'Çok Satan',
            'new': 'Yeni',
            'discount': 'İndirim',
            'healthy': 'Sağlıklı',
            'hot': 'Sıcak',
            'breakfast': 'Kahvaltı'
        };
        const isOutOfStock = product.product_qr_status === '2';
        const badgeText = isOutOfStock ? 'Tükendi' : (product.badge ? badgeMap[product.badge] || product.badge : null);
        const hasFeatureBadge = Boolean(product.badge) && !isOutOfStock;
        const image = String(product.image || '').trim();
        const hasImage = Boolean(image) && product.image_source !== 'company_logo';
        const basePrice = Number(product.basePrice || product.price || 0);
        const priceLabel = String(product.priceLabel || '').trim() || (Number.isFinite(basePrice) ? `₺${basePrice.toLocaleString('tr-TR')}` : '');
        if (isOutOfStock) card.classList.add('product-out-of-stock');
        if (hasFeatureBadge) card.classList.add('product-card--featured');
        if (!hasImage) card.classList.add('product-card--no-media');

        const orderType = localStorage.getItem('menuOrderType');
        const translations = window.I18N?.getTranslations?.();
        const lang = window.I18N?.getPreferredLanguage?.() || 'tr';
        const viewLabel = translations?.[lang]?.product_action_view || 'İncele';
        const addLabel = translations?.[lang]?.product_action_add || 'Ekle';
        const actionLabel = window.TahmisciCatalog ? viewLabel : (isOutOfStock ? viewLabel : (orderType === 'tableMenu' ? viewLabel : addLabel));

        card.innerHTML = `
            ${hasImage ? `<div class="product-image">
                <div class="image-loading-spinner"></div>
                <img data-src="${image}" alt="${product.name || ''}" class="lazy-image">
                ${badgeText ? `<div class="product-badge${isOutOfStock ? ' product-badge-out' : ''}">${badgeText}</div>` : ''}
            </div>` : ''}
            <div class="product-content">
                <div class="product-header">
                    <h3 class="product-name">${product.name || ''}</h3>
                </div>
                <p class="product-description">${product.description || ''}</p>
                ${priceLabel ? `<div class="product-price"><span class="current-price">${priceLabel}</span>${product.oldPrice ? `<span class="old-price">₺${Number(product.oldPrice).toLocaleString('tr-TR')}</span>` : ''}</div>` : ''}
            </div>
            <div class="product-footer">
                <button class="product-add-btn" type="button">${actionLabel}</button>
            </div>
        `;

        card.addEventListener('click', () => window.openProductModal?.(product.id));
        const actionButton = card.querySelector('.product-add-btn');
        actionButton?.addEventListener('click', (event) => {
            event.stopPropagation();
            window.openProductModal?.(product.id);
        });

        return card;
    }

    // Ürünler sadece seçim yapıldıktan sonra yüklensin (branch_id + order_type); DOMContentLoaded ile erken çağrı boş sonuç verir.
    document.addEventListener('menuSelectionChanged', () => {
        currentCategoryId = 0;
        currentMenuSearchTerm = "";
        cachedMenuProducts = [];
        cachedProductsByCategory = {};
        loadMenuProducts();
    });
    // Kategoriler render olur olmaz, ürün yoksa otomatik yükleme yap.
    document.addEventListener('categoriesLoaded', () => {
        if (!Array.isArray(window.MenuProducts) || window.MenuProducts.length === 0) {
            currentCategoryId = 0;
            loadMenuProducts();
        }
    });
    window.addEventListener('languageChanged', () => {
        cachedMenuProducts = [];
        cachedProductsByCategory = {};
        currentCategoryId = 0;
        loadMenuProducts();
    });
    window.addEventListener('publicBootstrapUpdated', () => {
        cachedMenuProducts = [];
        cachedProductsByCategory = {};
        currentCategoryId = 0;
        loadMenuProducts();
    });
})();




