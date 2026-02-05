export const ExpiratonStatus = {
    EXPIRED: 'expired',
    EXPIRING_SOON: 'expiring_soon',
    VALID: 'valid',

    fromDate(expirationDate) {
        const days = Math.ceil(
            (new Date(expirationDate) - new Date()) / (1000 * 60 * 60 *24)
            // milisegundos - minutos - horas -dias
        )

    if (days < 0) return this.EXPIRED
    if (days <= 5) return this.EXPIRING_SOON
    return this.VALID
    }
}