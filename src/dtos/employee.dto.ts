interface CreateEmployeeDTO {
    firstName: string;
    lastName: string;
    DOB: Date;
    email: string;
    phoneNumber: string;
    position: string;
    password: string;
    branchId: number;
    managerId: number;
}

interface EmployeeLoginDTO {
    email: string;
    password: string;
}

interface UpdateEmployeeDTO {
    firstName: string;
    lastName: string;
    DOB: Date;
    phoneNumber: string;
}



export{ CreateEmployeeDTO, EmployeeLoginDTO, UpdateEmployeeDTO };