import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import  app_name from './exe_name.json'
const curr_platform=process.platform;
const { exec } = require('child_process');
import hotkeys from 'hotkeys-js';

function check_application_win32(ele){
  if(curr_platform==="win32"){
    let result=exec('tasklist', (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
    
      if (stdout.includes(ele.win32)) {
        
        return true;
      }else{
        return false;
      }
    });
    return result;
  }
  if (process.platform === 'darwin') {
    let result=exec(`ps aux | grep -v grep | grep -q ${ele.darwin}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      if (stdout) {
        result=true;
      } else{
        return false;
      }
    });
    return result;
  }
}



// Close the Notepad application on Windows

// if (process.platform === 'win32') {
  for(const ele in app_name){
    console.log(check_application_win32(app_name[ele].win32)," in function")
    if(check_application_win32(app_name[ele])){
      console.log("in close appli");
      if(curr_platform=="win32"){
        
      exec(`taskkill /IM ${app_name[ele].win32} /F`, (err, stdout, stderr) => {
        if (err) {
          console.error("error occured in closing ",app_name[ele].win32);
          return;
        }
        console.log(stdout);
      });
      }
      if(curr_platform=="darwin"){
        exec(`killall ${app_name[ele].darwin}`, (err, stdout, stderr) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(stdout);
        });
      }
    }
    
  }
  
// }



function Home() { 
  useEffect(() => {
    // window is accessible here.
    window.location.href=('https://assessment.securedexam.com/');
    
    
  }, []);
  
  // alert("hello there");
  return (
    <React.Fragment>
      <Head> 
        <title>Test Yourself</title>
      </Head>
      
    </React.Fragment>
  );
}
 
export default Home;
