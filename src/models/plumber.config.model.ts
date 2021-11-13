export interface PlumberConfig {
    repository: string,
    requireReview?: boolean | number,
    rhel: number
    branchPrefix?: string
    labels?: {
        needsCi?: string
        needsReview?: string
        needsBz?: string
        needsAcks?: string
        dontMerge?: string
        ciWaived?: string
    }
}
