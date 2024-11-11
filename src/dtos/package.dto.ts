interface createPackageDTO {
    customerFirstName: string,
    customerLastName: string,
    customerStreet: string,
    customerCity: string,
    customerState: string,
    customerZipcode: string,
    recipientStreet: string,
    recipientCity: string,
    recipientState: string,
    recipientZipcode: string,
    weight: number,
    dimensions: string,
    amount: number,
    shippingMethod: string,
    status: string,
    shippingDate: Date,
    deliveryDate: Date,
}

interface updatePackageDTO {
    packageId: number,
    status: string,
    shippingDate: Date,
    deliveryDate: Date,
    currentBranchId: number,
}

export {createPackageDTO, updatePackageDTO}