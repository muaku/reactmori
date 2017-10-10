import { SINPAKU_KOKYUU_DATA_IN, FACE_DATA_IN } from "../types"

export default function data (state = {}, action = {}) {
    switch(action.type) {
        case SINPAKU_KOKYUU_DATA_IN:
            return action.data
        case FACE_DATA_IN:
            return action.data
        default: 
            return state
    }
}