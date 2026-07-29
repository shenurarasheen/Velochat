export const validateFullName = (name: string) : string | null => {
    if (!name || name.trim().length === 0) {
        return "Full Name can not be empty!"
    }

    return null;
}

export const validateEmail = (email: string) : string | null => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email || email.trim().length === 0) {
        return "Email address can not be empty!"
    }
    if (!regex.test(email)) {
        return "Please enter a valid email address!"
    }

    return null;
}

export const validateCountryCode = (countryCode: string) : string | null => {
    const regex = /^\+[1-9]\d{0,3}$/;

    if (!countryCode) {
        return "Country code can not be empty";
    }

    if (!regex.test(countryCode)) {
        return "Please enter a valid country code";
    }

    return null;
}

export const validateContactNo = (number: string) : string | null => {
    const regex = /^[1-9][0-9]{6,14}$/;

    if (!number || number.trim().length === 0) {
        return "Contact Number can not be empty!"
    }

    if (!regex.test(number)) {
        return "Please enter a valid contact number";
    }

    return null;
}

export const validateOTP = (otp: string) : string | null => {
    if (!otp) {
        return "Please Enter the OTP code that received to your mobile"
    }

    if (otp.length !== 5) {
        return "OTP must have 5 characters"
    }

    return null;
}

export const validateProfileImage = (image: {uri: string, type?: string, size?: number} | null) : string | null => {

    if (!image) {
        return null;
    }

    if (image.type && !['image/jpeg', 'image/jpg', 'image/png'].includes(image.type)) {
        return "Please select a valid image type (JPG, JPEG, PNG)"
    }

    if (image.size && image.size > 10 * 1024 * 1024) {
        return "Profile image must be less than 10MB"
    }

    return null
}