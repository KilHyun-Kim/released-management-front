import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import * as api from 'library/api/exApi';
import { RootState } from 'main/store/createStore';

const name = 'techSlice';

export const fetchList = createAsyncThunk(
  `${name}/fetchList`,
  async({name}: {name: string}, thunkAPI) => {
    try { 
      return (await api.getData());
    } catch(error: any){
      return thunkAPI.rejectWithValue(await error.response.data);
    }
  }
);

export interface techList {
  visible: boolean;
  data: Array<any>;
  selectData: Array<any>;
  filterData: any;
}

const initialState: techList = {
  visible: false,
  data: [], //api를 사용해서 가져올 데이터
  selectData: [], //choice page에서 선택한 데이터
  filterData: [], //choice page에서 filter한 데이터 -> choice 페이지에서 사용하기
};

export const techSlice = createSlice({
  name,
  initialState,
  reducers: {
    setTech: (
      state,
      //payloadaction의 <>값은 임시로 만들어둔것
      action: PayloadAction<{ name: string }>,
    ) => {
      state.data.push(action.payload);
    },
    setSelect: (
      state,
      action: PayloadAction<Array<any>>,
    ) => {
      state.selectData.push(action.payload)
    },
    setFilter: (
      state,
      action: PayloadAction<Array<any>>,
    ) => {
      state.filterData = action.payload
    }
  },
  extraReducers: {
    [fetchList.pending.type]: (state) => {
      //호출 전
      state.visible = true;
    },
    [fetchList.fulfilled.type]: (state, action) => {
      //성공
      state.visible = true;
      state.data = action.payload;
    },
    [fetchList.rejected.type]: (
      state,
      action: PayloadAction<techList>,
    ) => {
      //실패
      state.visible = true;
      state.data= action.payload.data;
    }
  }
});

export const listState = (state: RootState) => state.techSlice.data

export function division(n:any, arr:Array<any>) {
  const arr_temp = JSON.parse(JSON.stringify(arr));
  const len = arr_temp.length;
  const cnt = Math.floor(len / n) + (Math.floor(len % n) > 0 ? 1 : 0);
  const tmp = [];

  if(arr_temp.length > 0){
    arr_temp.map((item : any, index : number) => {
      arr_temp[index] = item
    })

    for (let i = 0; i < cnt; i++) {
      tmp.push(arr_temp.splice(0, n));
    }
  }
  
  return tmp;
}

export const getMainFilter = createSelector(listState, data => {
  return division(3, data)
});

const { actions, reducer } = techSlice;
export const { setTech, setSelect, setFilter } = actions;

export const data = (state: RootState) => state.techSlice.data;
export const selectData = (state: RootState) => state.techSlice.selectData;
export const filterData = (state: RootState) => state.techSlice.filterData;
export const visible = (state: RootState) => state.techSlice.visible;

export default reducer;
