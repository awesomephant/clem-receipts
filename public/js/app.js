let formFields;

function init(){
    let submitEl = document.querySelector('#js-submit')
    formFields = document.querySelectorAll('input[type="text"]')
    submitEl.addEventListener('click', function(e){
        e.preventDefault();
        let words = []
        for (let i = 0; i < formFields.length; i++){
            let field = formFields[i];
            words.push(field.value)
        }
        console.log(words)
        socket.emit('submission', words)

        window.setTimeout(function(){
            window.location = '/thankyou'
        }, 1000)
    })
}

window.addEventListener('DOMContentLoaded', function(){
    init();
})
