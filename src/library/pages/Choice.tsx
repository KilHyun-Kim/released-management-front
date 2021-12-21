import React, { Component, useState, useEffect, useCallback, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {data, selectData, filterData} from '../reducers/tech/techSlice'
import {setTech, setFilter, fetchList, modifyClick} from '../reducers/tech/techSlice'
import Circle from '../components/main/Circle';
import { request } from '../../main/axios/Http';
import styled, { css } from 'styled-components';
import MulTextField from '../components/main/mul/TextField'
import InputBox from '../components/main/InputBox'
// import ComboBox from '../components/main/mul/ComboBox'
import { createSelector } from '@reduxjs/toolkit';
import ClearIcon from '@mui/icons-material/Clear';
import Loading from '../components/main/loading/loading'
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

function division(n:any, arr:Array<any>) {
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

const getMainFilters = createSelector(filterData, data => {
  return division(3, data)
});

export function Choice(){
  const [inputdata, setInputdata] = useState<any>("")
  const clearicon = useRef<any>(null);
  const inputref = useRef<any>(null);

  const data_selector: Array<any> = useSelector(data);
  // Circle에 filter해서 나타낼때 사용하는 변수
  const filterlist: any = useSelector(getMainFilters)
  const dispatch = useDispatch();

  //초기 세팅
  useEffect(() => {
    dispatch(fetchList({name: "React"}));
    // input에서 esc 키 누르면 초기화 기능
    window.addEventListener("keydown", function(event){
      if(event.key == "Escape"){
        if(inputref.current){
          inputref.current.firstChild.value = '';
          setInputdata('');
          if(clearicon.current){
            clearicon.current.style.display = 'none'
          }
        }
      }
    })
  }, []);

  useEffect(() => {
    const temp_list = JSON.parse(JSON.stringify(data_selector))
    const f_list:any = filterFunc(temp_list)
    if(f_list.length == 0){
      dispatch(setFilter(temp_list))
    }
    else{
      dispatch(setFilter(f_list))
    }
  }, [inputdata])

  //inputdata 값에 따른 데이터 필터 함수
  function filterFunc(props: Array<any>){
    if(!props) return null
    const temp_list:any = []
    props.map((item:any) => {
      if(item.name.indexOf(inputdata) >= 0){
        temp_list.push(item)
      }
    })
    return temp_list
  }

  //input 값 변경됬을때
  const onChange = useCallback((event: any) => {
    const event_value = event.target.value
    if(clearicon.current){
      event_value == '' ? clearicon.current.style.display = 'none' : clearicon.current.style.display = 'inline'
    }
    setInputdata(event_value)
  }, [inputdata])

  const onClick = ((event?:any) => {
    let nodename : any = null
    event == null ? nodename = null: nodename = event.target.nodeName

    async function PostItems(data: any){
      await request("POST", "/selects", data);
    }

    switch(nodename){
      //circle click
      case 'DIV': {
        const selectItem : any = event.target.parentNode.innerText
        //click of filterdata 
        dispatch(modifyClick(selectItem))
        break
      }
      //input X button
      case 'svg':{
        if(inputref.current){
          inputref.current.firstChild.value = '';
          setInputdata('');
          if(clearicon.current){
            clearicon.current.style.display = 'none'
          }
        }
        break
      }
      //선택 완료 버튼 클릭
      case 'BUTTON':{
        const Items = data_selector.filter((item : any) => {
          return item.click == true
        })
        console.log("ITEMS : ", Items)
        // PostItems(Items)
        break
      }
      default : {
        break
      }
    }
  })


  /* useEffect(() => {
    async function fetchTech() {
      const data= await request("GET", "/techs");
      console.log(data);
    }
    fetchTech();
  },[]) */
  // ** 
  //temp count
  // const circle_count = [['React', 'Vue', 'Angular'], ['Spring', 'Go', 'Node'], ['Figma', 'Trello', 'Jira']];
  return (
    <div style={styles.root}>
      <div style={styles.wrap}>
        <MulTextField style={styles.mulTextField}  
          onChange={onChange}
          ref={inputref}
        />
        <ClearIcon onClick={onClick} ref={clearicon} style={styles.clearIcon}/>
      </div>
      <div style={styles.container}>
        {filterlist.map((value : any, index1: any) => (
          <div key={index1} style={styles.circlewrap}>
            {value.map((value1 : any, index2: number) => (
              <div key={index2} style={styles.circlediv}>
                {<Circle style={styles.cursor} onClick={onClick} props={value1["click"]} />}
                <div>{value1["name"]}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <Link to="/Main" style={styles.linkstyle}>
        <Button variant="outlined" style={styles.choicebButton} onClick={onClick}>선택 완료</Button>
      </Link>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties} = {
  root:{
    width: '648px',
    height: '380px',
    position: 'relative',
    display: 'block',
    top: '20px',
    marginLeft: '32%'
  },
  wrap: {
    width: '100%',
  },
  container: {
    height: '300px',
    width: '300px',
    position: 'relative',
    display: 'block',
    marginLeft: '155px',
    top: '20px',
  },
  in_div: {
    width: '70px',
    height: '100px',
    marginLeft: '15px'
  },
  circlewrap: {
    width: '633px',
    height: '100px',
    position: 'relative',
    display: 'flex',
  },
  cirCle:{
    marginLeft: '40px',
    marginRight: '40px',
    cursor: 'pointer'
  },
  mulTextField:{
    width: '400px',
    position: 'relative',
    right: '27px'
  },
  clearIcon: {
    display: 'none', 
    position: 'absolute',
    right: '165px',
    top: '10px',
    cursor: 'pointer',
  },
  choicebButton: {
    position: 'relative',
    width: '305px',
    height: '75px',
    top: '50px',
    right: '20px'
  },
  cursor:{
    cursor: 'pointer'
  },
  circlediv:{
    marginRight: '40px'
  },
  linkstyle:{
    textDecoration: 'none',
  }
} as const;

export default Choice;
