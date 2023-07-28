import {atom} from "recoil"
//create separate file atoms.ts in src
export const userDataState = atom({
    key: 'userDataState',
    default: {
        _id: '',
        name: '',
        email: '',
        avatar: '',
        role: '',
    },
  });