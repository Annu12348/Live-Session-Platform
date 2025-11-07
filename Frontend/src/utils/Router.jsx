import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../page/Home'
import Session from '../page/Session'

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/session/:unique_id' element={<Session />} />
      
    </Routes>
  )
}

export default Router
