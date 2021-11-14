$(function() {
    if($('textarea').length) {
        CKEDITOR.replace('ta');
    }

    $('a.confirmDeletion').on('click', function() {
        if (!confirm ('Are you sure you want to delete this page?')) 
        return false;
    });

    if($("[data-fancybox]").length) {
        $("[data-fancybox]").fancybox();
    }
})