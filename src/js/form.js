(($) => {

    window.NETWERVEN = window.NETWERVEN || {};

    NETWERVEN.applyForm = {
        init : function() {
            this.bindEvents();
            this.dropboxUploader('resume');

            $("#birth").datepicker({
                changeMonth: true,
                changeYear: true,
                dateFormat: "yy-mm-dd"
            });
            
        },

        bindEvents: function() {
            const validity = $('#applyForm')[0].checkValidity;

            if (typeof validity === 'function') {
                const formElements = $("#applyForm")[0].elements;

                $.each(formElements, this.eventHandler);
                this.formSubmit();

            } else {
                const form = $("form[name='applyForm']");
                
                $.each(form, (index, section) => {
                    const formElements = $(section)[0].elements;
                    $.each(formElements, this.eventHandler);
                });
                this.formSubmitIE();
            }
        },

        eventHandler: function(index, input) {
            const that = NETWERVEN.applyForm;

            if( $(input).attr('type') === 'file' || $(input).attr('name') === 'birth' ) {
                $(input).on('change', (e) => {
                    that.validateField(input);
                });
            } else{
                $(input).on('focusout', () => {
                    that.validateField(input);
                });
            }
        },

        validateField: function(field) {
            var err = 0;

            if(field.value === '' && ( $(field).attr('required') || $(field).attr('required') === 'required'  )) {
                err++;
            }

            if(field.name === 'email') {
                const email = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                if( !email.test(field.value) ) {
                    err++;    
                }
            }

            if(field.name === 'zipcode') {
                const zipcode = RegExp("[0-9]{4}[a-zA-Z]{2}");

                if( !zipcode.test(field.value) ) {
                    err++;
                }
            }

            if($(field).attr('type') === 'file') {
                const valid = this.checkFileType(field);
                const filetype = $(field).data('filetype');
                const $form = $("form[name='applyForm']").find(`.form-row.${filetype}`);

                if(valid){
                    $form.find('.valid').show();
                    $form.find('.invalid, .error-msg').hide();
                }else{
                    err++;
                    $form.find('.invalid, .error-msg').show();
                    $form.find('.valid').hide();
                }
            }

            if(err > 0){
                $(field).not("input[type='file']").addClass('error');
            }else{
                $(field).removeClass('error');
            }

            return err;
        },

        validateFileFields: function(filetype) {
            var files = 0;
            var $fields = $("form[name='applyForm']").find(`input[data-filetype="${filetype}"]`);
            var $form = $("form[name='applyForm']").find(`.form-row.${filetype}`);

            $.each($fields, function(index, field) {
                if( $(field).val() !== ''){
                    files++;
                }
            });

            if(files > 0){
                $form.find('.valid').show();
                $form.find('.invalid, .error-msg').hide();
            }else{
                $form.find('.invalid, .error-msg').show();
                $form.find('.valid').hide();
            }

            return files;
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

        },

        dropboxUploader: function(filetype) {
            const $form = $(`form[name='applyForm'] [data-filetype='${filetype}'][type='hidden']`);
            const options = {
                success: (files) => {
                    const file = files[0].link;
                    $form.val(file);
                    this.validateFileFields(filetype);
                },
                cancel: () => {
                    this.validateFileFields(filetype);
                },
                linkType: "direct",
                extensions: ['.pdf', '.doc', '.docx', '.rtf', '.txt'],
                folderselect: false,
            };

            $('#dropboxCV').on('click', (e) => {
                e.preventDefault();
                Dropbox.choose(options);
            })
        },

        formSubmit: function() {
            $('#applyForm').on('submit', (e) =>{
                e.preventDefault();

                var valid = $('#applyForm')[0].checkValidity();
                valid = NETWERVEN.applyForm.validateFileFields('resume') ? valid : false;
                
                if(valid) {
                    this.displayThanks();
                }

                return false;
            });
        },

        formSubmitIE: function() {
            const that = this;
            $('form').on('submit', (e) => {
                e.preventDefault();
                return false;
            });

            $('#submit').on('click', (e) => {
                e.preventDefault();

                const form = $("form[name='applyForm']");
                let valid = 0;
                
                $.each(form, (index, section) => {
                    const formElements = $(section)[0].elements;
                    $.each(formElements, (index, value) => {
                        valid += that.validateField(value);
                    });
                });

                if(valid > 0) {
                    return false;
                }else{
                    this.displayThanks();
                }

            });
        },

        displayThanks: () => {
            $('#application').hide('slow', ()=> {
                setTimeout(() => {
                    $('#thanks').fadeIn();
                },100);
            });
        }
    }

    $(document).ready(() => {
        NETWERVEN.applyForm.init();
    });

})(jQuery, jQuery.datepicker);