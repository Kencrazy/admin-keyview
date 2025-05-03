import React,{useEffect} from 'react'
import { orderTime } from '../../constants';
import { Megaphone,Star,Blocks,Target,PackagePlus } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis,PieChart,Pie,Cell,Legend } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { listOfIntegrations } from '../../constants';
import CalendarLayout from '../../components/google_calendar';
import { style } from 'framer-motion/client';
function AnalyticsPage() {
    
    const { theme } = useTheme();
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    (async () => {

        const topology = await fetch(
            'https://code.highcharts.com/mapdata/countries/vn/vn-all.topo.json'
        ).then(response => response.json());
    
        const data = [
            ['vn-3655', 10], ['vn-qn', 11], ['vn-kh', 12], ['vn-tg', 13],
            ['vn-bv', 14], ['vn-bu', 15], ['vn-hc', 16], ['vn-br', 17],
            ['vn-st', 18], ['vn-pt', 19], ['vn-yb', 20], ['vn-hd', 21],
            ['vn-bn', 22], ['vn-317', 23], ['vn-nb', 24], ['vn-hm', 25],
            ['vn-ho', 26], ['vn-vc', 27], ['vn-318', 28], ['vn-bg', 29],
            ['vn-tb', 30], ['vn-ld', 31], ['vn-bp', 32], ['vn-py', 33],
            ['vn-bd', 34], ['vn-724', 35], ['vn-qg', 36], ['vn-331', 37],
            ['vn-dt', 38], ['vn-la', 39], ['vn-3623', 40], ['vn-337', 41],
            ['vn-bl', 42], ['vn-vl', 43], ['vn-tn', 44], ['vn-ty', 45],
            ['vn-li', 46], ['vn-311', 47], ['vn-hg', 48], ['vn-nd', 49],
            ['vn-328', 50], ['vn-na', 51], ['vn-qb', 52], ['vn-723', 53],
            ['vn-nt', 54], ['vn-6365', 55], ['vn-299', 56], ['vn-300', 57],
            ['vn-qt', 58], ['vn-tt', 59], ['vn-da', 60], ['vn-ag', 61],
            ['vn-cm', 62], ['vn-tv', 63], ['vn-cb', 64], ['vn-kg', 65],
            ['vn-lo', 66], ['vn-db', 67], ['vn-ls', 68], ['vn-th', 69],
            ['vn-307', 70], ['vn-tq', 71], ['vn-bi', 72], ['vn-333', 73]
        ];
    
        Highcharts.mapChart('vietnam_container', {
            chart: {
            map: topology,
            backgroundColor: theme === "light" ? "#ffffff" : "#0F172A"
            },
        
            title: {
            text: 'Map Preview',
            style:{
                color: theme === "light" ? "#0F172A" : "#ffffff"
            }
            },
        
            mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
            },
        
            colorAxis: {
            min: 0, //Change later
            },
        
            series: [{
            data: data,
            name: 'Orders Location',
            states: {
                hover: {
                color: '#BADA55'
                }
            },
            // legend:{
            //     style:{
            //         color: theme === "light" ? "#0F172A" : "#ffffff"
            //     }
            // },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
            }]
        });
    
    })();
    const data = [
        { name: 'Website', value: 400 },
        { name: 'Mobile', value: 300 },
        { name: 'Others', value: 300 }
      ];
    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Analytics</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-7'>
                <div className='card col-span-1 md:col-span-2 lg:col-span-3'>
                    <div id='vietnam_container' ></div>
                </div>

                <div className='card col-span-1 md:col-span-2 lg:col-span-4'>
                    <div className='card-header'>
                        <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <Megaphone size={26} />
                        </div>
                        <div className='card-title' >Suggested Advertisement Time</div>
                    </div>
                    <div className="card-body p-0">
                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <AreaChart
                                data={orderTime}
                                margin={{
                                    top: 0,
                                    right: 0,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="colorTotal"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#2563eb"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#2563eb"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    cursor={false}
                                    formatter={(value) => `$${value}`}
                                />

                                <XAxis
                                    dataKey="time"
                                    strokeWidth={0}
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickMargin={6}
                                />
                                <YAxis
                                    dataKey="totalOrders"
                                    strokeWidth={0}
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickFormatter={(value) => `${value}`}
                                    tickMargin={6}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="totalOrders"
                                    stroke="#2563eb"
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-7'>
                <div className="card col-span-1 md:col-span-2 lg:col-span-4">
                    <div className="card-header justify-between">
                        <div className='flex flex-row items-center gap-2'>                        
                            <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <Blocks size={26}/>
                            </div>
                            <p className='card-title'>List of Integrations</p>
                        </div>

                        <div className="w-fit rounded-lg bg-blue-500/20 p-2 hover:opacity-50 cursor-pointer text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <PackagePlus size={26}/>
                        </div>
                    </div>

                    <div className="card-body p-0">
                        <div className="relative h-[400px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                            <table className="table">
                                <thead className="table-header">
                                    <tr className="table-row">
                                        <th className="table-head">#</th>
                                        <th className="table-head">Shop Name</th>
                                        <th className="table-head">Total Sales</th>
                                        <th className="table-head">Sales</th>
                                        <th className="table-head">Rating</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {listOfIntegrations.map((shop) => (
                                        <tr
                                            key={shop.number}
                                            className="table-row"
                                        >
                                            <td className="table-cell">{shop.number}</td>
                                            <td className="table-cell">
                                                <div className="flex w-max gap-x-4">
                                                    <img
                                                        src={shop.image}
                                                        alt={shop.name}
                                                        className="size-14 rounded-lg object-cover"
                                                    />
                                                    <div className="flex flex-col">
                                                        <p>{shop.name}</p>
                                                        <p className="font-normal text-slate-600 dark:text-slate-400">{shop.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="table-cell">{shop.totalSales}</td>
                                            <td className="table-cell">${shop.sales}</td>
                                            <td className="table-cell">
                                                <div className="flex items-center gap-x-2">
                                                    <Star
                                                        size={18}
                                                        className="fill-yellow-600 stroke-yellow-600"
                                                    />
                                                    {shop.rating}
                                                </div>
                                            </td>
                                            {/* <td className="table-cell">
                                                <div className="flex items-center gap-x-4">
                                                    <button className="text-blue-500 dark:text-blue-600">
                                                        <PencilLine size={20} />
                                                    </button>
                                                    <button className="text-red-500">
                                                        <Trash size={20} />
                                                    </button>
                                                </div>
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className='card col-span-1 md:col-span-2 lg:col-span-3'>
                    <div className='card-header'>
                        <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <Target size={26}/>
                        </div>
                        <p className='card-title'>Sales Overview</p>
                    </div>
                    <div className='card-body p-0'>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie 
                                    data={data}
                                    innerRadius={100}
                                    outerRadius={160}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            <div className='card lg:flex hidden'>
                <CalendarLayout/>
            </div>
        </div>
    )
}

export default AnalyticsPage