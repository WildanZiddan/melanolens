// type AbbreviateNumberProps = {
//     value: number
// }

// const AbbreviateNumber = ({ value }: AbbreviateNumberProps) => {
//     function formatNumberWithSuffix(number: number) {
//         if (number >= 1000000) {
//             return (number / 1000000).toFixed(1) + 'M'
//         } else if (number >= 1000) {
//             return (number / 1000).toFixed(1) + 'K'
//         } else {
//             return number.toFixed(0).toString()
//         }
//     }

//     return <>{formatNumberWithSuffix(value)}</>
// }

// export default AbbreviateNumber

type AbbreviateNumberProps = {
    value: number
}

const AbbreviateNumber = ({ value }: AbbreviateNumberProps) => {
    function formatNumberWithSuffix(number: number) {
        // 🔑 SENSOR PENGAMAN UTAMA: Jika data kosong, undefined, null, atau NaN, langsung amanin balikkan '0'
        if (number === undefined || number === null || isNaN(number)) {
            return '0'
        }

        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M'
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K'
        } else {
            return number.toFixed(0).toString()
        }
    }

    // Amankan juga passing value di level props biar ga lolos crash duluan
    return <>{formatNumberWithSuffix(value)}</>
}

export default AbbreviateNumber