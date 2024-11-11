interface CreateTrackingHistoryDTO {
    packageId: number,
    status: string,
}

interface getTrackingHistoryDTO {
    trackingId: number,
    packageId: number,
    status: string,
    updatedDate: Date,
    location: string,
}

export {CreateTrackingHistoryDTO, getTrackingHistoryDTO}