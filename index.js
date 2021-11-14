function validator(object) {
    let selectorRules = {}
    let formElement = document.querySelector(object.form);
    function getParent (element, selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
            return element.parentElement
            }
            element = element.parentElement;
        }
    }
    function validate (inputElement, rule, errorSpan ) {
        let errorMessage;
        let rules = selectorRules[rule.selector];
        for(let i = 0; i<rules.length; i++){
            switch(inputElement.type){
                case 'radio':
                    errorMessage = rules[i](document.querySelector(rule.selector + ':checked'));
                break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if(errorMessage) break;
        }
        if(errorMessage) {
            console.log(errorMessage);
            errorSpan.innerText = errorMessage;
            getParent(inputElement, object.formGroupSelector).classList.add('invalid')
        }
        else {
            errorSpan.innerText = "";
            getParent(inputElement, object.formGroupSelector).classList.remove('invalid')
        }
        return !errorMessage;
    }
    if(formElement){ 
        formElement.onsubmit= e => {
            e.preventDefault();
            let isFormValid = true;
            object.rules.forEach(rule => {
                const inputElement = formElement.querySelector(rule.selector);
                const errorSpan = getParent(inputElement, object.formGroupSelector).querySelector(".form-message");
                let isValid = validate(inputElement,rule,errorSpan);
                if(!isValid){
                    isFormValid = false;
                }
            })
            
            if(isFormValid){
                if( typeof object.onSubmit === 'function'){
                    let inputs = formElement.querySelectorAll('[name]');
                    console.log(inputs);
                    let formValues = Array.from(inputs).reduce ((values, input) => {
                        switch (input.type){
                            case 'radio':
                                if (input.checked) {
                                    values[input.name] = input.value
                                }
                               break;
                            default:
                                (values[input.name] = input.value)
                        }
                        return  values;

                },{})
                object.onSubmit(formValues);
                }
            }
        }
        console.log(formElement)
        object.rules.forEach(rule => {
            const inputElements = formElement.querySelectorAll(rule.selector);
        
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }
            else {
                selectorRules[rule.selector] = [rule.test]

            }
            Array.from(inputElements).forEach((inputElement) => {
                const errorSpan = getParent(inputElement, object.formGroupSelector).querySelector(".form-message");
                if(inputElement){
                    inputElement.onblur = () => {
                        validate(inputElement,rule,errorSpan);
                    }
                    inputElement.oninput = () => {
                        errorSpan.innerText = "";
                        getParent(inputElement, object.formGroupSelector).classList.remove('invalid')
                    }
                }

            })
        });
    }


}

validator.isEmail = function(selector){
    return {
        selector,
        test: function(value){
            const reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
            return reg.test(value) ? undefined : 'Vui lòng nhập đúng email'
        }
    }

}

validator.isRequired = function(selector){
    return{
        selector: selector,
        test(value){
            return value ? undefined : 'Vui lòng nhập thông tin';
        }
    }
}

validator.isPhoneNumber = function(selector){
    return {
        selector: selector,
        test(value){
            const reg = /^\d{10}$/
            return reg.test(value) ? undefined : `Vui lòng nhập đúng số điện thoại`
        }
    }
}
var err = document.getElementsByClassName('error');
validator({
    form: "#form",
    formGroupSelector: '.form-group',
    rules: [
        validator.isRequired("#nameInput"),
        validator.isRequired("#mailInput"),
        validator.isEmail("#mailInput"),
        validator.isRequired("#phoneInput"),
        validator.isPhoneNumber("#phoneInput"),
        validator.isRequired('input[name="package"]')
    ],
    onSubmit: function () {
        alert("Đăng ký thành công")
    }
})
var registerBtn = document.querySelector('#registerNow');
var checkpackage = document.querySelectorAll('input[name="package"]')
var packagePrice = document.querySelector(".packagePrice")
var priceMessage  = document.querySelector(".priceMessage");
registerBtn.addEventListener('click',() =>{
    window.location = '#form';
})
for(let item of checkpackage){
    item.addEventListener('change', (e) => {
        console.log(packagePrice)
        let target = e.target;
                let price;
                switch (target.id) {
                    case 'oneYear':
                        price = target.value;
                        break;
                    case 'lifeTime':
                        price = target.value;
                        break;
                }
                setTimeout(() =>{
                    priceMessage.textContent = ` Giá của giá học là ${price} VND `
                },10)
            
    })
}