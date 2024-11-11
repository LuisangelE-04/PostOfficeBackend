interface CreateCustomerDTO {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    street: string;
    city: string;
    state: string;
    zipcode: string;
}

interface CustomerLoginDTO {
    email: string;
    password: string;
}

interface UpdateCustomerDTO {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    street: string;
    city: string;
    state: string;
    zipcode: string;
}



export{ CreateCustomerDTO, CustomerLoginDTO, UpdateCustomerDTO };