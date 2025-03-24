(() => {
    const init = () => {
        buildHTML();
        buildCSS();
        loadProducts();
        setEvents();
    };

    const buildHTML = () => {
        const html = `
        <div class="you-may-like-section">
            <div class="carousel-container">
                <h1 class="carousel-title">You Might Also Like</h1>
                <button class="carousel-btn" id="prevBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242">
                        <path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path>
                    </svg>
                </button>
                <div class="myCarousel" id="carousel-grid"></div>
                <button class="carousel-btn" id="nextBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242">
                        <path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path>
                    </svg>
                </button>
            </div>
        </div>`;

        $('.product-detail').append(html);
    };

    const buildCSS = () => {
        const css = `
        .you-may-like-section { background-color: #faf9f7; display: flex; justify-content: center; }
        .carousel-container { position: relative; width: 80%; margin-left: 15px;  }
        .carousel-title { font-size: 24px; color: #29323b; line-height: 33px; font-weight: lighter; padding: 15px 0; }
        .myCarousel { width: 100%; overflow-x: scroll; scroll-behavior: smooth; display: grid; grid-template-columns: repeat(10, 200px); gap: 15px; padding-bottom: 24px;}
        .myCarousel::-webkit-scrollbar { display: none; }
        .card { width: 100%; height: auto; display: flex; flex-direction: column; background: white; position: relative;}
        .card a { width: 100%; height: 100%; cursor: pointer; }
        .card a img { width: 100%; height: 100%; object-fit: cover; }
        .card-price { color: #193db0; font-size: 18px; line-height: 22px; font-weight: bold; height: 50px; }
        .carousel-btn { position: absolute; top: 50%;border: none; background: transparent; }
        .info { display: flex; flex-direction: column; padding: 0 10px; margin-top: 5px; }
        .addCart-btn{background-color: #193db0; color: #fff; width: 100%; border-radius: 5px; border: none; line-height: 19px; font-size: 14px; font-weight: bold; height: 35px;}
        #prevBtn { left: -35px; }
        #nextBtn { right: -35px; transform: rotate(180deg); }
        .card-like-button {
            cursor: pointer;
            position: absolute;
            top: 9px;
            right: 13px;
            width: 34px;
            height: 34px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 3px 6px 0 rgba(0, 0, 0, .16);
            border: solid .5px #b6b7b9;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index:999;
        }
        .card-like-button.active svg path{fill: #193db0; stroke: #193db0;}
        @media (min-width: 992px) { .carousel-title { font-size: 32px; line-height: 43px; } .addCart-btn{display : none;}}
        @media (max-width: 991px) { .carousel-btn { display: none; } .carousel-container { width: 95%;} .card { height: 510px;} .myCarousel { grid-template-columns: repeat(10, 280px); gap: 20px; }}`;

        $('<style>').html(css).appendTo('head');
    };

    const setEvents = () => {
        $('#prevBtn').on('click', () => {
            $('#carousel-grid').scrollLeft($('#carousel-grid').scrollLeft() - 250);
        });

        $('#nextBtn').on('click', () => {
            $('#carousel-grid').scrollLeft($('#carousel-grid').scrollLeft() + 250);
        });

        $(document).on('click', '.card-like-button', function (e) {
            e.preventDefault();
            $(this).toggleClass('active');
            const isLiked = $(this).hasClass('active');
            updateLocalStorage($(this).attr('id'), isLiked);
        });
    };

    const updateLocalStorage = (productId, isLiked) => {
        let likedProductIds = JSON.parse(localStorage.getItem('likedProductIds') || '[]');

        if (isLiked) {
            if (!likedProductIds.includes(productId)) {
                likedProductIds.push(productId);
            }
        } else {
            likedProductIds = likedProductIds.filter(id => id !== productId);
        }

        localStorage.setItem('likedProductIds', JSON.stringify(likedProductIds));
    };


    const loadProducts = async () => {
        try {
            let productsData = localStorage.getItem('carouselProducts');
            let products;
            
            if (!productsData) {
                console.log("Fetching products from API");
                const response = await fetch("https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json");
                if (!response.ok) throw new Error(`Could not fetch data! Status: ${response.status}`);
                products = await response.json();               
                localStorage.setItem('carouselProducts', JSON.stringify(products));
            } else {
                console.log("Loading products from localStorage");
                products = JSON.parse(productsData);
            }
            
            renderProducts(products);
        } catch (error) {
            console.error(error);
        }
    };

    const renderProducts = (data) => {
        $('#carousel-grid').empty();
        
        const likedProductIds = JSON.parse(localStorage.getItem('likedProductIds') || '[]');

        data.forEach(item => {
            const card = $('<div>').addClass('card');
            const link = $('<a>').attr('href', item.url).attr('target', '_blank').append($('<img>').attr('src', item.img));
            const isLiked = likedProductIds.includes(item.id.toString());

            const likeButton = $('<button>')
                .attr('id', item.id)
                .addClass('card-like-button')
                .addClass(isLiked ? 'active' : '')
                .html(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="20.576" height="19.483" viewBox="0 0 20.576 19.483"><path fill="none" stroke="#555" stroke-width="1.5px" d="M19.032 7.111c-.278-3.063-2.446-5.285-5.159-5.285a5.128 5.128 0 0 0-4.394 2.532 4.942 4.942 0 0 0-4.288-2.532C2.478 1.826.31 4.048.032 7.111a5.449 5.449 0 0 0 .162 2.008 8.614 8.614 0 0 0 2.639 4.4l6.642 6.031 6.755-6.027a8.615 8.615 0 0 0 2.639-4.4 5.461 5.461 0 0 0 .163-2.012z" transform="translate(.756 -1.076)"></path></svg>
                `);

            const info = $('<div>').addClass('info').append(
                $('<span>').text(item.name),
                $('<div>').addClass('card-price').text(item.price),
                $('<button>').addClass('addCart-btn').text('SEPETE EKLE')
            );
            card.append(link, likeButton, info);
            $('#carousel-grid').append(card);
        });
    };

    $(document).ready(init);
})();
