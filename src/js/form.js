(($) => {

    window.NETWERVEN = window.NETWERVEN || {};

    NETWERVEN.applyForm = {
        init : function() {
            this.bindEvents();

            $("#birth").datepicker({
                changeMonth: true,
                changeYear: true,
                dateFormat: "yy-mm-dd"
            });
            
        },

        bindEvents: function() {
            const formElements = $("#applyForm")[0].elements;
            
            $.each(formElements, (index, el) => {
                // console.log({index, el});
                if(el.name === 'resume' || el.name === 'birth') {
                    $(el).on('change', () => {
                        this.validateField(el);    
                    })
                } else{
                    $(el).on('focusout', (e) => {
                        this.validateField(el);
                    });
                }

            });

            $('#applyForm').on('submit', function(e){
                e.preventDefault();

                var valid = $('#applyForm')[0].checkValidity();
                
                
                // TODO  --> validate the fileinput

                
                console.log({ valid })
            });
        },

        validateField: function(field) {
            // console.log({field})
            var err = 0;

            if(field.value === '' && $(field).attr('required')) {
                err++;
            }

            // if(field.name === 'birth') {
            //     const date = RegExp("([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))");
                
            //     if( !date.test(field.value) ) {
            //         err++;
            //     }
            // }

            if(field.name === 'zipcode') {
                const zipcode = RegExp("[0-9]{4}[a-zA-Z]{2}");

                if( !zipcode.test(field.value) ) {
                    err++;
                }
            }

            if(field.name === 'resume') {
                const valid = this.checkFileType(field);
                const $form = $("form[name='applyForm']");
                
                if(valid){
                    $form.find('.valid').show();
                    $form.find('.invalid, .error-msg').hide();
                }else{
                    err++;
                    $form.find('.invalid, .error-msg').show();
                    $form.find('.valid').hide();
                }
            }

            // console.log({err})
            if(err > 0){
                $(field).addClass('error');
            }else{
                $(field).removeClass('error');
            }
        },
        
        checkFileType: (input) => {
            const allowedExtensions = ['pdf', 'doc', 'docx', 'rtf', 'txt'];
            const value = $(input).val();
            const file = value.toLowerCase();
            const extension = file.substring(file.lastIndexOf('.') + 1);

            if ($.inArray(extension, allowedExtensions) == -1) {
                return false;
            } 
            
            return true;

        }
    }

    $(document).ready(() => {
        NETWERVEN.applyForm.init();
    });

})(jQuery, jQuery.datepicker);