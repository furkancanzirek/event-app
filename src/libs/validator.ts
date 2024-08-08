export const CreditCardValidator = (value: string): boolean => {
    const re = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/;
    
    if (!re.test(value)) return false;

    const luhnCheck = (ccNum: string): boolean => {
        let sum = 0;
        let shouldDouble = false;
        
        for (let i = ccNum.length - 1; i >= 0; i--) {
            let digit = parseInt(ccNum[i], 10);
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        
        return (sum % 10 === 0);
    };

    return luhnCheck(value.replace(/\D/g, '')); 
};


export const NameSurnameValidator = (value: string): boolean => {
    return /^[a-zA-Z\s-]{2,}$/.test(value); 
};


export const ExpiryDateValidator = (value: string): boolean => {
    const [month, year] = value.split('/').map(Number);
    const now = new Date();
    const currentMonth = now.getMonth() + 1; 
    const currentYear = now.getFullYear() % 100; 

    if (month < 1 || month > 12) return false;
    if (year < currentYear || (year === currentYear && month < currentMonth)) return false;

    return true;
};

export const CvvValidator = (value: string): boolean => {
    return /^[0-9]{3,4}$/.test(value);
};

export const checkCardValid = (
    cardNumber: string,
    name: string,
    expiryDate: string,
    cvv: string
): boolean => {
    return CreditCardValidator(cardNumber) &&
           NameSurnameValidator(name) &&
           ExpiryDateValidator(expiryDate) &&
           CvvValidator(cvv);
};
