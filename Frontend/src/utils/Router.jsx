import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../page/Home'
import Session from '../page/Session'
import NotFound from '../page/NotFound'

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/session/:unique_id' element={<Session />} />
      <Route path='/not-found' element={<NotFound />} />
    </Routes>
  )
}

export default Router
