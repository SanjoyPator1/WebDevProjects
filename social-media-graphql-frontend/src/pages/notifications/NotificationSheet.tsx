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
    <div className=' gap-3 p-3 md:w-[350px] lg:w-[450px] lg:grid-cols-[.75fr_1fr]'>
        {notificationData.map((notificationCardData : NotificationModel)=>{
            return <div className='mb-2 md:mb-3'>
                <NotificationCard {...notificationCardData} />
            </div>
        })}
    </div>
  )
}

export default NotificationSheet