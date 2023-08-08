import { FC } from 'react'
import NotificationCard from '../../components/Notifications/NotificationCard';
import { NotificationModel } from '../../models/component.model';

interface Props{
    notificationData: NotificationModel[]
}

const NotificationSheet:FC<Props> = ({notificationData}) => {

    console.log("in notification sheet")
    console.log({notificationData})

  return (
    <div className=' p-3 md:w-[350px] lg:w-[450px]'>
        <h3 className='mb-3 text-base'>Notifications</h3>
        {notificationData.map((notificationCardData : NotificationModel)=>{
            return <div className='mb-1 md:mb-2'>
                <NotificationCard {...notificationCardData} />
            </div>
        })}
        {notificationData.length===0 &&
        <div>
            <p className='italic'>No Notifications!</p>
        </div>
        }
    </div>
  )
}

export default NotificationSheet