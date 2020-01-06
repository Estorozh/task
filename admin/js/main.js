jQuery(document).ready(function ($) {
    // Сериализация формы в объект:
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    $('body').addClass('admin-panel');

    $('.popover-help').popover({ trigger: 'hover', delay: 500, html: true });
    /**
     * Ajax-управление статусами модулей:
     **/
    $(document).on('click', '.changeStatus', function (e) {
        e.preventDefault();
        if ((link = this) === undefined || (method = $(this).attr('method')) === undefined || (message = actionToken.messages['confirm_' + method]) === undefined)
            bootbox.confirm(actionToken.messages['unknown']);
        else {
            bootbox.confirm(message, function (result) {
                if (result) {
                    sendModuleStatus($(link).attr('module'), $(link).attr('status'));
                }
            });
        }
        return false;
    });
    /**
     * Ajax-управление сбросом кеша и ресурсов (assets):
     **/
    $(document).on('click', '.flushAction', function (e) {
        e.preventDefault();
        if ((link = this) === undefined || (method = $(this).attr('method')) === undefined || (message = actionToken.messages['confirm_' + method]) === undefined)
            bootbox.confirm(actionToken.messages['unknown']);
        else {
            bootbox.confirm(message, function (result) {
                if (result) {
                    sendFlush(link);
                }
            });
        }
        return false;
    });

    /**
     * Ajax-перехватчик для повторной отправки письма активации:
     */
    $(document).on('click', '.user.sendactivation', function () {
        var link = $(this);
        $.ajax({
            url: link.attr('href'),
            data: actionToken.token,
            dataType: 'json',
            type: 'post',
            success: function (data) {
                if (typeof data.data != 'undefined' && typeof data.result != 'undefined')
                    bootbox.alert('<i class="glyphicon glyphicon-' + (data.result ? 'ok' : 'remove') + '-sign"></i> ' + data.data);
                else
                    bootbox.alert('<i class="glyphicon glyphicon-remove-sign"></i> ' + actionToken.error);
            },
            error: function (data) {
                if (typeof data.data != 'undefined' && typeof data.result != 'undefined')
                    bootbox.alert('<i class=" glyphicon glyphicon-' + (data.result ? 'ok' : 'remove') + '-sign"></i> ' + data.data);
                else
                    bootbox.alert('<i class="glyphicon glyphicon-remove-sign"></i> ' + actionToken.error);
            }
        });
        return false;
    });
});

function ajaxSetStatus(elem, id) {
    $.ajax({
        url: $(elem).attr('href'),
        success: function () {
            $('#' + id).yiiGridView.update(id, {
                data: $('#' + id + '>.keys').attr('title')
            });
        }
    });
}

function ajaxSetSort(elem, id) {
    $.ajax({
        url: $(elem).attr('href'),
        success: function () {
            $('#' + id).yiiGridView.update(id);
        }
    });
}

function sendFlush(link) {
    var dataArray = [
        actionToken.token,
        'method=' + $(link).attr('method')
    ];

    var myDialog = bootbox.alert(actionToken.message);

    $(myDialog).find('div.modal-footer .btn').hide();
    $(myDialog).find('div.modal-footer').append(actionToken.loadingimg);
    /**
     * Запрет на закрытие бокса:
     **/
    $('.modal-backdrop').unbind('click');
    /**
     * Запрашиваем ответ сервера:
     **/
    $.ajax({
        url: $(link).attr('href'),
        data: dataArray.join('&'),
        type: 'POST',
        dataType: 'json',
        error: function (data) {
            $(myDialog).find('.modal-body').html(
                data.data ? data.data : actionToken.error
            );
            $(myDialog).find('div.modal-footer .btn').show();
            $(myDialog).find('div.modal-footer img').hide();
        },
        success: function (data) {
            if (typeof data.result != 'undefined' && typeof data.data != 'undefined' && data.result === true) {
                $(myDialog).find('.modal-body').html(data.data);
            } else {
                $(myDialog).find('.modal-body').html(
                    typeof data.data == 'undefined' ? actionToken.error : data.data
                );
            }
            $(myDialog).find('div.modal-footer .btn').show();
            $(myDialog).find('div.modal-footer img').hide();
            // При клике на кнопку - перегружаем страницу:
            $(myDialog).find('div.modal-footer .btn').click(function () {
                location.reload();
            });
        }
    });
}

function sendModuleStatus(name, status) {
    var dataArray = [
        actionToken.token,
        'module=' + name,
        'status=' + status
    ];

    var myDialog = bootbox.alert(actionToken.message);
    $(myDialog).find('div.modal-footer .btn').hide();
    $(myDialog).find('div.modal-footer').append(actionToken.loadingimg);
    /**
     * Запрет на закрытие бокса:
     **/
    $('.modal-backdrop').unbind('click');
    /**
     * Запрашиваем ответ сервера:
     **/
    $.ajax({
        url: actionToken.url,
        data: dataArray.join('&'),
        type: 'POST',
        dataType: 'json',
        error: function (data) {
            if (typeof data.result != 'undefined' && typeof data.data != 'undefined' && data.result === true) {
                $(myDialog).find('.modal-body').html(data.data);
            } else {
                $(myDialog).find('.modal-body').html(
                    typeof data.data == 'undefined' ? actionToken.error : data.data
                );
            }
            $(myDialog).find('div.modal-footer a.btn').show();
            $(myDialog).find('div.modal-footer img').hide();
            // При клике на кнопку - перегружаем страницу:
            $(myDialog).find('div.modal-footer a.btn').click(function () {
                location.reload();
            });
        },
        success: function (data) {
            if (typeof data.result != 'undefined' && typeof data.data != 'undefined' && data.result === true) {
                $(myDialog).find('.modal-body').html(data.data);
            } else {
                $(myDialog).find('.modal-body').html(
                    typeof data.data == 'undefined' ? actionToken.error : data.data
                );
            }
            $(myDialog).find('div.modal-footer .btn').show();
            $(myDialog).find('div.modal-footer img').hide();
            // При клике на кнопку - перегружаем страницу:
            $(myDialog).find('div.modal-footer .btn').click(function () {
                location.reload();
            });
        }
    });
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var pr = $(input).data('preview');
            var parent = $(input).data('parent');
            console.log(input.dataset.preview);
            if(pr) {
                if(parent)
                    $(input).closest(parent).find(pr).attr('src', e.target.result).show();
                else
                    $(pr).attr('src', e.target.result).show();
            }
            else
                $('.preview-image').attr('src', e.target.result).show();
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function CopyToClipboard(containerid) {
    var target = document.getElementById(containerid);
    var rng, sel;
    
    if (document.createRange) {
        rng = document.createRange();
        rng.selectNode(target)
        sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(rng);
    } else {
        var rng = document.body.createTextRange();
        rng.moveToElementText(target);
        rng.select();
    }

    var text_alert = "Ссылка скопирована в буфер обмена";

    if($('#' + containerid).attr('data-text-alert'))
        text_alert = $('#' + containerid).attr('data-text-alert');

    document.execCommand("copy");
    sweetAlert({
        title: "",
        text: text_alert,
        type: 'success',
        timer: 2000,
        showConfirmButton: false
    });
    window.getSelection().removeAllRanges();
}

function CopyToClipboardFromText(text) {
    setTimeout(function() {
        var textField = document.createElement('textarea');
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
    }, 10);
}

// автоматическое копирование
jQuery(document).ready(function ($) {
    $(document).on('click', '.clipboard-copy-btn', function() {
        var clipboard_text = '';
        
        if($(this).hasClass('clipboard-copy-href'))
            clipboard_text = $(this).attr('href');
        else
            clipboard_text = $(this).attr('data-clipboard-text');

        var alert_text = $(this).attr('data-alert-text');

        if(clipboard_text) {
            CopyToClipboardFromText(clipboard_text);

            sweetAlert({
                title: "",
                text: alert_text ? alert_text : "Скопировано в буфер обмена",
                type: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }
        return false;
    });
});
