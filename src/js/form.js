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
            const formElements = $("#applyForm")[0].elements;
            
            $.each(formElements, (index, el) => {
                if($(el).attr('type') === 'file' || el.name === 'birth') {
                    $(el).on('change', () => {
                        this.validateField(el);    
                    });
                } else{
                    $(el).on('focusout', () => {
                        this.validateField(el);
                    });
                }
            });

            $('#applyForm').on('submit', (e) =>{
                e.preventDefault();

                var valid = $('#applyForm')[0].checkValidity();
                valid = NETWERVEN.applyForm.validateFileFields('resume') ? valid : false;
                
                if(valid) {
                    $('#application').hide('slow', ()=> {
                        setTimeout(() => {
                            $('#thanks').fadeIn();
                        },100);
                    });
                }

                return false;
            });
        },

        validateField: function(field) {
            var err = 0;

            if(field.value === '' && ( $(field).attr('required') || $(field).attr('required') === 'required'  )) {
                err++;
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
                $(field).addClass('error');
            }else{
                $(field).removeClass('error');
            }
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
                    console.log({files});
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
        }
    }

    $(document).ready(() => {
        NETWERVEN.applyForm.init();
    });

})(jQuery, jQuery.datepicker);