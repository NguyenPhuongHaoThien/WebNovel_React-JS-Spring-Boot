import React from 'react'
import {BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsChat, BsBookHalf, BsPerson } from 'react-icons/bs'
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line} from 'recharts';
import { UserContext } from '../../../Contexts/UserContext';

function AdminHome() {
    const data = [
        {
          name: 'Huyền Huyễn',
          views: 4000,
          likes: 2400,
          chapters: 120,
        },
        {
          name: 'Tiên Hiệp',
          views: 3000,
          likes: 1398,
          chapters: 80,
        },
        {
          name: 'Võng Du',
          views: 2000,
          likes: 9800,
          chapters: 90,
        },
        {
          name: 'Đồng Nhân',
          views: 2780,
          likes: 3908,
          chapters: 100,
        },
        {
          name: 'Khoa Huyễn',
          views: 1890,
          likes: 4800,
          chapters: 75,
        },
        {
          name: 'Đô Thị',
          views: 2390,
          likes: 3800,
          chapters: 60,
        },
        {
          name: 'Dã Sử',
          views: 3490,
          likes: 4300,
          chapters: 110,
        },
        {
          name: 'Huyền Nghi',
          views: 2200,
          likes: 3200,
          chapters: 70,
        },
        {
          name: 'Kì Ảo',
          views: 1800,
          likes: 2900,
          chapters: 50,
        },
        {
          name: 'Cảnh Kỹ',
          views: 2600,
          likes: 3700,
          chapters: 85,
        },
      ];

  return (
    <main className='admin-main-container'>
        <div className='admin-main-title'>
            <h3>DASHBOARD</h3>
        </div>

        <div className="admin-main-cards">
            <div className="admin-card">
              <div className="admin-card-inner">
                <h3>NOVELS</h3>
                <BsFillArchiveFill className="admin-card-icon" />
              </div>
                <h1>300</h1>
            </div>
            <div className='admin-card'>
                <div className='admin-card-inner'>
                    <h3>CATEGORIES</h3>
                    <BsFillGrid3X3GapFill className='admin-card-icon'/>
                </div>
                <h1>12</h1>
            </div>
            <div className='admin-card'>
                <div className='admin-card-inner'>
                    <h3>CHAPTERS</h3>
                    <BsBookHalf className='admin-card-icon'/>
                </div>
                <h1>1500</h1>
            </div>
            <div className='admin-card'>
                <div className='admin-card-inner'>
                    <h3>AUTHORS</h3>
                    <BsPerson className='admin-card-icon'/>
                </div>
                <h1>50</h1>
            </div>
            <div className='admin-card'>
                <div className='admin-card-inner'>
                    <h3>CUSTOMERS</h3>
                    <BsPeopleFill className='admin-card-icon'/>
                </div>
                <h1>33</h1>
            </div>
            <div className="admin-card">
              <div className="admin-card-inner">
                <h3>COMMENTS</h3>
                <BsChat className="admin-card-icon" />
              </div>
                <h1>42</h1>
            </div>
        </div>

        <div className='admin-charts'>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#8884d8" />
                <Bar dataKey="likes" fill="#82ca9d" />
            </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="chapters" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </main>
  )
}

export default AdminHome
