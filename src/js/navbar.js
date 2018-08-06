

($ => {
    window.NETWERVEN = window.NETWERVEN || {};
    
    NETWERVEN.navbar = {
        init: () => {
            
            $('.navbar-toggler').on('click', (e) => {
                e.preventDefault();

                const $navbar = $('.navbar-collapse');

                if( $navbar.hasClass('show') ) {
                    $('.body-overlay').fadeOut().remove();
                }else {
                    var overlay = $('<div>').addClass('body-overlay');
                    $('body').append(overlay);
                    $('.body-overlay').fadeIn();
                }
                $navbar.toggleClass('show');
            });

            $('.navbar-collapse').on('click', '.close', (e) => {
                e.preventDefault();

                $('.navbar-toggler').trigger('click');
            });

            $('body').on('click', '.body-overlay', (e) => {
                e.preventDefault();
                
                $('.navbar-toggler').trigger('click');
            });
        }
    }

    $(document).ready(() => {
        NETWERVEN.navbar.init();
    });

})(jQuery);