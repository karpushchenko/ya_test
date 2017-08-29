var fio = document.getElementById("fio");
var email = document.getElementById("email");
var phone = document.getElementById("phone");
var form = document.getElementById("myForm");
var MyForm = {
    validate: function() {
        var obj = {
            isValid: true,
            errorFields: []
        };
        var notValid = $('#myForm').find('.error');
        for (i = 0; i < notValid.length; i++) {
            obj.errorFields.push(notValid[i].name);
        }
        if (obj.errorFields.length) {
            obj.isValid = false;
        }
        return obj
    },
    getData: function() {
        var obj = {};
        var formElements = $('#myForm').find('input');
        for (i = 0; i < formElements.length; i++) {
            if (formElements[i].value) {
                var key = formElements[i].name;
                obj[key] = formElements[i].value;
            }
        }

        return obj;
    },
    setData: function(obj) {
        for (var key in obj) {
            console.log(key + " is " + obj[key]);
            if ($('input[name="' + key + '"]')) {
                $('input[name="' + key + '"]').val(obj[key]);
            }
        }
    },
    submit: function() {
        url = $('#myForm').attr('action');

        var posting = $.post(url);
        posting.done(function(data) {
            console.log(data);
            console.log(data['status']);
            var response = jQuery.parseJSON(data);

            console.log(response.status);
            switch (response.status) {
                case 'success':
                    $('#resultContainer').addClass('success').html('<p class="animated infinite bounce">Success</p>');
                    break;
                case 'error':
                    $('#resultContainer').addClass('error').html('<p class="animated infinite bounce">' + response.reason + '</p>');
                    break;
                case 'progress':
                    $('#resultContainer').addClass('progress');
                    setTimeout(MyForm.submit, response.timeout);
                    break;
                default:
                    console.log('No answer');
                    break;
            }
        });

    }

}

// Валидация ФИО

fio.addEventListener("input", function(event) {
    if (fio.validity.patternMismatch) {
        fio.setCustomValidity("Введите три слова");
        $(this).addClass('error');
    } else {
        fio.setCustomValidity("");
        $(this).removeClass('error');
    }
});

// Валидация E-mail

email.addEventListener("input", function(event) {
    if (email.validity.typeMismatch) {
        email.setCustomValidity("Введите существующий E-mail");
        $(this).addClass('error');
    } else if (email.validity.patternMismatch) {
        email.setCustomValidity("Принимаются только адреса E-mail зарегистрированные в доменах ya.ru, yandex.ru, yandex.ua, yandex.by, yandex.kz, yandex.com");
        $(this).addClass('error');
    } else {
        email.setCustomValidity("");
        $(this).removeClass('error');
    }
});

// Валидация телефона

jQuery(function($) {
    $("#phone").mask("+7(999)999-99-99");
});
$("#phone").change(function() {
    var numbers = phone.value.match(/[0-9]/g);
    var sum = numbers.reduce(function(total, num) {
        return parseInt(total) + parseInt(num);
    });
    if (sum > 30) {
        $("#phone").addClass('error')
        phone.setCustomValidity("Сумма всех цифр телефона не должна превышать 30");
        return false;
    } else {
        $("#phone").removeClass('error');
        phone.setCustomValidity("");
    }
});

// Отправка формы

$("#myForm").submit(function(event) {

    event.preventDefault();
    $( '#submitButton' ).attr( "disabled", "disabled" );
    MyForm.submit();

});


// TEST

// $("body").click(function() {
//     console.log('click');
//     MyForm.validate();
//     console.log(MyForm.validate());
//     MyForm.getData();
//     console.log(MyForm.getData());
//     MyForm.setData({fio: "Node js master", email: "teacher@yandex.kz", phone: "+7(921)010-10-01", fake: "no valid input here"})
// });