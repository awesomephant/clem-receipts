let formFields;

function hasNumber(s) {
    return /\d/.test(s);
}
function isFormValid() {
    formFields = document.querySelectorAll('input[type="text"]')
    let result = true;
    for (let a = 0; a < formFields.length; a++) {
        formFields[a].classList.remove('invalid')
    }

    // No two enties can be the same
    for (let i = 0; i < formFields.length; i++) {
        for (let j = 0; j < formFields.length; j++) {
            if (j != i && formFields[i].value === formFields[j].value) {
                console.log(`Form values ${i} and ${j} are the same (${formFields[i].value})`)
                formFields[i].classList.add('invalid')
                formFields[j].classList.add('invalid')
                result = false
            }
        }
    }

    // No line can be empty
    for (let b = 0; b < formFields.length; b++) {
        if (formFields[b].value === '') {
            console.log(`Form field ${b} is empty`)
            formFields[b].classList.add('invalid')
            result = false
        }
    }

    // No numbers
    for (let i = 0; i < formFields.length; i++) {
        if (hasNumber(formFields[i].value)) {
            console.log(`Form field ${i} has a number`)
            formFields[i].classList.add('invalid')
            result = false
        }
    }
    // No punctuation
    for (let i = 0; i < formFields.length; i++) {
        if (/[!"£$%^&*()+=:;@'~#{}\[\]<>,.?/]/g.test(formFields[i].value)) {
            console.log(`Form field ${i} has puncutation`)
            formFields[i].classList.add('invalid')
            result = false
        }
    }

    return result
}

function init() {
    let submitEl = document.querySelector('#js-submit')
    formFields = document.querySelectorAll('input[type="text"]')
    submitEl.addEventListener('click', function (e) {
        e.preventDefault();
        let words = []
        for (let i = 0; i < formFields.length; i++) {
            let field = formFields[i];
            words.push(field.value)
        }
        if (isFormValid()) {
            socket.emit('submission', words)
            window.setTimeout(function () {
                window.location = '/thankyou'
            }, 1000)
        }
    })
}

window.addEventListener('DOMContentLoaded', function () {
    init();
})
