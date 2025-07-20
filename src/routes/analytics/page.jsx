import React,{useEffect} from 'react'
import { Megaphone,Star,Blocks,Target,PackagePlus } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis,PieChart,Pie,Cell,Legend } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { listOfIntegrations } from '../../constants';
import CalendarLayout from '../../components/google_calendar';
import { style } from 'framer-motion/client';
function AnalyticsPage({event,setEvents,orderData}) {
    const orderTime = [
    { time: "08:00 AM - 10:00 AM", totalOrders: 0 },
    { time: "10:00 AM - 12:00 PM", totalOrders: 0 },
    { time: "12:00 PM - 02:00 PM", totalOrders: 0 },
    { time: "02:00 PM - 04:00 PM", totalOrders: 0 },
    { time: "04:00 PM - 06:00 PM", totalOrders: 0 },
    { time: "06:00 PM - 08:00 PM", totalOrders: 0 },
    { time: "08:00 PM - 10:00 PM", totalOrders: 0 },
    { time: "10:00 PM - 12:00 AM", totalOrders: 0 },
    ];

    const timeStringToMinutes = (timeStr) => {
    const [hourMin, period] = timeStr.split(" ");
    let [hour, min] = hourMin.split(":").map(Number);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return hour * 60 + min;
    };

    orderData.forEach(order => {
        const date = new Date(order.orderedDate);
        const minutes = date.getHours() * 60 + date.getMinutes();

        for (let slot of orderTime) {
            const [startStr, endStr] = slot.time.split(" - ");
            const startMin = timeStringToMinutes(startStr);
            const endMin = timeStringToMinutes(endStr);

            if (startMin > endMin) {
            if (minutes >= startMin || minutes < endMin) {
                slot.totalOrders++;
                break;
            }
            } else {
            if (minutes >= startMin && minutes < endMin) {
                slot.totalOrders++;
                break;
            }
            }
        }
    });
    
    const { theme } = useTheme();
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    (async () => {

        const topology = await fetch(
            'https://code.highcharts.com/mapdata/countries/vn/vn-all.topo.json'
        ).then(response => response.json());
    
    const regionCodeMap = {
    'vn-3655': 'Hà Nội',
    'vn-qn': 'Quảng Ninh',
    'vn-kh': 'Khánh Hòa',
    'vn-tg': 'Tiền Giang',
    'vn-bv': 'Bà Rịa - Vũng Tàu',
    'vn-bu': 'Bình Dương',
    'vn-hc': 'Hồ Chí Minh',
    'vn-br': 'Bà Rịa - Vũng Tàu',
    'vn-st': 'Sóc Trăng',
    'vn-pt': 'Bình Thuận',
    'vn-yb': 'Yên Bái',
    'vn-hd': 'Hải Dương',
    'vn-bn': 'Bắc Ninh',
    'vn-317': 'Hải Phòng',
    'vn-nb': 'Ninh Bình',
    'vn-hm': 'Hà Nam',
    'vn-ho': 'Hòa Bình',
    'vn-vc': 'Vĩnh Phúc',
    'vn-318': 'Nam Định',
    'vn-bg': 'Bắc Giang',
    'vn-tb': 'Thái Bình',
    'vn-ld': 'Lâm Đồng',
    'vn-bp': 'Bình Phước',
    'vn-py': 'Phú Yên',
    'vn-bd': 'Bình Định',
    'vn-724': 'Tây Ninh',
    'vn-qg': 'Quảng Ngãi',
    'vn-331': 'Cần Thơ',
    'vn-dt': 'Đồng Tháp',
    'vn-la': 'Long An',
    'vn-3623': 'Đắk Lắk',
    'vn-337': 'Đà Nẵng',
    'vn-bl': 'Bạc Liêu',
    'vn-vl': 'Vĩnh Long',
    'vn-tn': 'Thái Nguyên',
    'vn-ty': 'Tuyên Quang',
    'vn-li': 'Lai Châu',
    'vn-311': 'Bắc Kạn',
    'vn-hg': 'Hà Giang',
    'vn-nd': 'Nam Định',
    'vn-328': 'Quảng Bình',
    'vn-na': 'Nghệ An',
    'vn-qb': 'Quảng Bình',
    'vn-723': 'Bình Thuận',
    'vn-nt': 'Ninh Thuận',
    'vn-6365': 'Đắk Nông',
    'vn-299': 'Kiên Giang',
    'vn-300': 'Cà Mau',
    'vn-qt': 'Quảng Trị',
    'vn-tt': 'Thừa Thiên Huế',
    'vn-da': 'Đà Nẵng',
    'vn-ag': 'An Giang',
    'vn-cm': 'Cà Mau',
    'vn-tv': 'Trà Vinh',
    'vn-cb': 'Cao Bằng',
    'vn-kg': 'Kiên Giang',
    'vn-lo': 'Lào Cai',
    'vn-db': 'Điện Biên',
    'vn-ls': 'Lạng Sơn',
    'vn-th': 'Thanh Hóa',
    'vn-307': 'Quảng Nam',
    'vn-tq': 'Tuyên Quang',
    'vn-bi': 'Đồng Nai',
    'vn-333': 'Hậu Giang',
    };

    const provinceToCode = {};
    for (const [code, province] of Object.entries(regionCodeMap)) {
        provinceToCode[province.toLowerCase()] = code;
    }

    const regionCount = {};
    for (const code of Object.keys(regionCodeMap)) {
        regionCount[code] = 0;
        }

        orderData.forEach(order => {
        const address = order.address.toLowerCase();

        for (const [province, code] of Object.entries(provinceToCode)) {
            if (address.includes(province)) {
            regionCount[code]++;
            break;
            }
        }
    });

    const mapData = Object.entries(regionCount)
    
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
                min: 0,
            },
        
            series: [{
            data: mapData,
            name: 'Orders Location',
            states: {
                hover: {
                color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
            }]
        });
    
    })();

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
                                    formatter={(value) => `${value}`}
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

            <div className='card lg:flex hidden'>
                <CalendarLayout event={event} setEvents={setEvents}/>
            </div>
        </div>
    )
}

export default AnalyticsPage