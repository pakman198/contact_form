

($ => {
    Netwerven = {
        init: () => {
            console.log('hola');
            $('.navbar-toggler').on('click', (e) => {
                e.preventDefault();
            });
        }
    }

    $(document).ready(() => {
        Netwerven.init();
    });

})(jQuery);