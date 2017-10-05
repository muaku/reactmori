import { SINPAKU_KOKYUU_DATA_IN } from "../types"
import { store } from "../store"

let dispatch = store.dispatch

/* Normal redux actions */
// export const sinpakuKokyuuDataIn = (data) => {
//     type: SINPAKU_KOKYUU_DATA_IN,   // type
//     data                            // playload
// }


/* Thunk actions */
export const gotSinpakuKokyuuData = (data) => {
    dispatch({
        type: SINPAKU_KOKYUU_DATA_IN,   // type
        data
    })
}