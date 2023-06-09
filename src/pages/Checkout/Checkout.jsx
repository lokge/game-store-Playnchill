import React, {useContext} from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
} from '@chakra-ui/react'
import {CustomContext} from "../../utils/Context";
import {useNavigate} from "react-router-dom";
import {CgClose} from "react-icons/cg";
import {useForm} from "react-hook-form";
import axios from "../../utils/axios";

const Checkout = () => {

    const navigate = useNavigate()

    //Получение данных с корзины
    const {basket, delBasket, user, setBasket} = useContext(CustomContext)

    const {reset, register, handleSubmit} = useForm()

    const addOrder = async (data) => {
        await axios.post('http://localhost:6969/buys', {
            ...data,
            games: basket,
            price: basket.reduce((acc, rec) => acc + rec.count * rec.price, 0),
            user: user,
            date: new Date()
        }).then(() => console.log('Успешно добавлен'))

        await axios.patch(`http://localhost:6969/users/${user.id}`, {
            games : {
                games: basket,
                price: basket.reduce((acc, rec) => acc + rec.count * rec.price, 0),
                date: new Date()
            }
        }).then(() => console.log('Успешно добавлен'))


        await navigate('/order')
        await reset()
    }

    return (
        <section className="checkout">
            <div className="container">
                <h2 className="basket__title">Оформление <span className="basket__title-count">заказа</span></h2>
                <form onSubmit={handleSubmit(addOrder)} className="checkout__row">
                    <div className="checkout__content">
                        <form className="checkout__form">
                            <p className="checkout__form-title">Способ оплаты</p>
                            <Accordion>
                                <div className="checkout__form-block">
                                    <AccordionItem>
                                        <h2>
                                            <AccordionButton>
                                                <Box as="span" flex='1' textAlign='left'>
                                                    <h5 className="checkout__form-title">Кредитная карта</h5>
                                                </Box>
                                                <AccordionIcon/>
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            <div className="checkout__form-box">
                                                <div className="checkout__form-box-head">
                                                    <p className="checkout__form-title checkout__form-box-title">Информация
                                                        о карте</p>
                                                </div>
                                                <input {...register("number")}  required placeholder="Номер карты" type="number"
                                                       className="checkout__form-input"/>
                                                <div className="checkout__input-box">
                                                    <input {...register("number")} required placeholder="Срок действия" type="number"
                                                           className="checkout__form-input"/>
                                                    <input {...register("password")} required maxLength="4" placeholder="CVV" type="password"
                                                           className="checkout__form-input"/>
                                                </div>
                                                <p className="checkout__form-notif">
                                                    Обязательно: сохранить данный метод для будущих покупок?
                                                </p>
                                                <div className="checkout__labels">
                                                    <label className="checkout__labels-label" htmlFor="firstCheck">
                                                        Да
                                                        <input className="checkout__labels-radio" id="firstCheck"
                                                               type="radio"/>
                                                    </label>
                                                    <label className="checkout__labels-label" htmlFor="check">
                                                        Нет
                                                        <input className="checkout__labels-radio" id="check"
                                                               type="radio"/>
                                                    </label>
                                                    <p className="checkout__form-notif">
                                                        При сохранении платёжной информации данный метод платежа будет
                                                        использоваться по умолчанию для всех покупок в Playnchill,
                                                        включая покупки в Fortnite, Rocket League, Fall Guys и
                                                        Playnchill Store. Платёжную информацию можно удалить на данном
                                                        экране, либо войдя в учётную запись Playnchill и выбрав пункт
                                                        «Управление платежами» в настройках.
                                                    </p>
                                                </div>
                                            </div>
                                        </AccordionPanel>
                                    </AccordionItem>
                                </div>

                                <div className="checkout__form-block">
                                    <AccordionItem>
                                        <h2>
                                            <AccordionButton>
                                                <Box as="span" flex='1' textAlign='left'>
                                                    <h5 className="checkout__form-title">PayPal</h5>
                                                </Box>
                                                <AccordionIcon/>
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            <div className="checkout__form-box">
                                                <p className="checkout__form-notif">
                                                    Обязательно: сохранить данный метод для будущих покупок?
                                                </p>
                                                <div className="checkout__labels">
                                                    <label className="checkout__labels-label" htmlFor="firstCheck">
                                                        Да
                                                        <input className="checkout__labels-radio" id="firstCheck"
                                                               type="radio"/>
                                                    </label>
                                                    <label className="checkout__labels-label" htmlFor="check">
                                                        Нет
                                                        <input className="checkout__labels-radio" id="check"
                                                               type="radio"/>
                                                    </label>
                                                    <p className="checkout__form-notif">
                                                        При сохранении платёжной информации данный метод платежа будет
                                                        использоваться по умолчанию для всех покупок в Playnchill,
                                                        включая покупки в Fortnite, Rocket League, Fall Guys и
                                                        Playnchill. Платёжную информацию можно удалить на данном экране,
                                                        либо войдя в учётную запись Playnchill и выбрав пункт
                                                        «Управление платежами» в настройках.
                                                    </p>
                                                </div>
                                                <p className="checkout__form-link">
                                                    Для подтверждения платежа вы будете перенаправлены на сайт PayPal, а
                                                    затем — снова на сайт Playnchill для завершения покупки.
                                                </p>
                                            </div>
                                        </AccordionPanel>
                                    </AccordionItem>
                                </div>
                            </Accordion>
                        </form>
                    </div>
                    <aside className="checkout__aside">
                        <p className="checkout__aside-title">ОПИСАНИЕ ЗАКАЗА</p>
                        {
                            basket.map((item) => (
                                basket.length > 1
                                    ? <div key={item.id} className="checkout__aside-content">
                                        <div className="checkout__aside-small">
                                            <div className="checkout__aside-small-content">
                                                <span className="checkout__aside-small-imgCont">
                                                  <img src={item.image} alt={item.title}
                                                       className="checkout__aside-small-img"/>
                                              </span>
                                                <div className="checkout__aside-small-text">
                                                    <h3 onClick={() => navigate(`/product/${item.id}`)}
                                                        className="checkout__aside-small-gameTitle">{item.title}</h3>
                                                    <p className="checkout__aside-small-price">{item.price * item.count} Р</p>
                                                </div>
                                            </div>
                                            <span onClick={() => delBasket(item.id)} className="checkout__aside-icon">
                                                <CgClose size="15px" fill="rgba(255, 255, 255, 0.2)"/>
                                            </span>
                                        </div>
                                    </div>
                                    : <div key={item.id} className="checkout__aside-content">
                                          <span className="checkout__aside-imgCont">
                                    <img src={item.image} alt="" className="checkout__aside-img"/>
                                </span>
                                        <h3 onClick={() => navigate(`/product/${item.id}`)}
                                            className="checkout__aside-gameTitle">{item.title}</h3>
                                        <div className="checkout__aside-prices">
                                            <p className="checkout__aside-price">Цена</p>
                                            <p className="checkout__aside-price">{item.price * item.count} Р</p>
                                        </div>
                                    </div>
                            ))
                        }
                        <div className="checkout__aside-prices">
                            <p className="checkout__aside-final">Итого</p>
                            <p className="checkout__aside-final">{basket.reduce((acc, rec) => acc + rec.count * rec.price, 0)} Р</p>
                        </div>
                        <div className="checkout__aside-email">
                            <input className="checkout__aside-input" type="checkbox"/>
                            <p className="checkout__aside-sendEmail">
                                Щёлкните здесь, чтобы предоставить ваш адрес электронной почты Rockstar Games. Rockstar
                                Games будет использовать этот адрес в соответствии с политикой конфиденциальности,
                                пожалуйста, ознакомьтесь с ней.
                            </p>
                        </div>
                        <div className="checkout__aside-btns">
                            <p className="checkout__aside-btn-text">
                                Нажимая «Оформить заказ» ниже, я подтверждаю, что мне исполнилось 18 лет, а также то,
                                что я являюсь авторизованным пользователем данного метода оплаты и принимаю условия
                                Лицензионного соглашения.
                            </p>
                            <button type="submit" className="checkout__aside-btn">ОФОРМИТЬ ЗАКАЗ</button>
                        </div>
                    </aside>
                </form>
            </div>
        </section>
    );
};

export default Checkout;