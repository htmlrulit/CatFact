import React, { useContext, useEffect, useState } from 'react';
import {Panel, PanelHeader, Group, Div, Text, PanelHeaderBack, Button, Snackbar} from '@vkontakte/vkui';
import { GlobalContext } from '../context';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {Icon16Done, Icon20CopyOutline, Icon20DownloadOutline} from "@vkontakte/icons";

const RandomCat = ({ id }) => {
    const { go } = useContext(GlobalContext);
    const randomCat = JSON.parse(localStorage.getItem('randomCat'));
    const [width, height] = useWindowSize();
    const [snackbar, setSnackbar] = useState(null);
    const [showConfetti, setShowConfetti] = useState(true);
    const [catInfo, setCatInfo] = useState('');
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
    const [randomJoke, setRandomJoke] = useState('');
    const [gifClickCount, setGifClickCount] = useState(0);

    const catJokes = [
        "Почему кошки любят петь? Потому что у них есть кошачий хор!",
        "Почему кошка сидит на клавиатуре? Она пытается написать мемуары!",
        "Почему коты не рассказывают шуток? Потому что они боятся быть непонятыми!",
        "Почему кошки такие плохие ди-джеи? Потому что они всегда царапают пластинки!",
        "Почему кошки хорошие детективы? Потому что у них есть 9 жизней, чтобы разгадать все тайны!"
    ];

    const gifMessages = [
        "Я танцую, не мешай",
        "Не мешай, говорю(",
        "Пожалуйста, не надо",
        "Я сбиваюсь",
        "Зачем ты это делаешь?",
        "Бесит!",
        "Постоянно пунькают мне в носик!",
        "А я не просил пунькать!",
        "Не одобрял пуньканье!",
        "Хватит!",
        "Ну сколько можно?",
        "Пунькать не надоело?",
        "Мой носик не для пуньканья!",
        "Дай мне потанцевать!",
        "Пунькать можно только по расписанию!",
        "Нсовместимо!",
        "Ты вообще понимаешь, что такое пунькать?",
        "Пунькание — это серьезно!",
        "Все котики не одобряют!",
        "Я танцую, а ты пунькаешь!",
        "Как тебе не стыдно?",
        "Пунькать — это непрофессионально!",
        "Котики требуют справедливости!",
        "Я буду жаловаться на пуньканье!",
        "Пуньканье — это серьезное нарушение!",
        "Ну всё, я обиделся!",
        "Мой танец испорчен!",
        "Я протестую против пуньканья!",
        "Официальное заявление: хватит пунькать!"
    ];

    useEffect(() => {
        setRandomJoke(catJokes[Math.floor(Math.random() * catJokes.length)]);
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowWelcomeMessage(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!randomCat) {
        go('home');
        return null;
    }

    useEffect(() => {
        const info = `
            Порода: ${randomCat.breed}
            Страна: ${randomCat.country}
            Окраски: ${randomCat.colors.join(', ')}
            Вес: ${randomCat.weight}
            Средняя стоимость: ${randomCat.price}
            Описание: ${randomCat.description}
        `;
        setCatInfo(info.trim());
    }, [randomCat]);

    const downloadImage = async () => {
        try {
            const response = await fetch(randomCat.image);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${randomCat.breed}.jpg`);
            link.setAttribute('target', '_blank');
            if (navigator.userAgent.includes('Safari')) {
                link.setAttribute('rel', 'noopener noreferrer');
                link.setAttribute('download', '');
                link.addEventListener('click', () => {
                    setTimeout(() => {
                        URL.revokeObjectURL(url);
                    }, 100);
                }, { once: true });
            }
            link.click();
            showDownloadSnackbar();
        } catch (error) {
            console.error('Failed to download image:', error);
        }
    };

    const showCopiedSnackbar = () => {
        setSnackbar(
            <Snackbar
                onClose={() => setSnackbar(null)}
                duration="1500"
                before={<Icon16Done fill="var(--vkui--color_icon_positive)" />}
            >
                Мяу! Информация скопирована!
            </Snackbar>
        );
    };

    const showDownloadSnackbar = () => {
        setSnackbar(
            <Snackbar
                onClose={() => setSnackbar(null)}
                duration="1500"
                before={<Icon16Done fill="var(--vkui--color_icon_positive)" />}
            >
                Фото сделано!
            </Snackbar>
        );
    };

    const showHiddenCatSnackbar = () => {
        setSnackbar(
            <Snackbar
                onClose={() => setSnackbar(null)}
                duration="2000"
                before={<Icon16Done fill="var(--vkui--color_icon_positive)" />}
            >
                Спасибо, что погладили меня!
            </Snackbar>
        );
    };

    const handleGifClick = () => {
        if (gifClickCount < gifMessages.length) {
            setSnackbar(
                <Snackbar
                    onClose={() => setSnackbar(null)}
                    duration="500"
                    before={<Icon16Done fill="var(--vkui--color_icon_positive)" />}
                >
                    {gifMessages[gifClickCount]}
                </Snackbar>
            );
            setGifClickCount(gifClickCount + 1);
        }
    };

    return (
        <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={() => go('home')} />}>
                Поздравляем!
            </PanelHeader>
            {showConfetti && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />}
            {showWelcomeMessage &&
                <Div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                    <Text weight="heavy" style={{ fontSize: 22 }}>
                        Кот в мешке!
                    </Text>
                </Div>
            }
            <Group>
                <Div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img
                        src={randomCat.image}
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '16px'
                        }}
                        alt="Кот"
                        onClick={showHiddenCatSnackbar}
                    />
                    <Text weight="heavy" style={{ marginTop: 16, fontSize: 22 }}>
                        {randomCat.breed}
                    </Text>
                    <Text weight="regular" style={{ color: 'gray', marginTop: 8 }}>
                        {randomCat.country}
                    </Text>
                </Div>
                <Div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Text weight="regular" style={{ fontSize: 16, marginBottom: 8, alignItems: 'center', flexDirection: 'column'  }}>
                        <b>Окраски:</b> {randomCat.colors.join(', ')}
                    </Text>
                    <Text weight="regular" style={{ fontSize: 16, marginBottom: 8, alignItems: 'center', flexDirection: 'column'  }}>
                        <b>Вес:</b> {randomCat.weight}
                    </Text>
                    <Text weight="regular" style={{ fontSize: 16, marginBottom: 8, alignItems: 'center', flexDirection: 'column'  }}>
                        <b>Средняя стоимость:</b> {randomCat.price}
                    </Text>
                    <Text weight="regular" style={{ fontSize: 16, marginTop: 16, alignItems: 'center', flexDirection: 'column'  }}>
                        {randomCat.description}
                    </Text>
                </Div>
                <Div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Text weight="bold" style={{ fontSize: 18 }}>
                        Вы сегодня как {randomCat.breed}!
                    </Text>
                    <Text weight="regular" style={{ fontSize: 16, marginTop: 8 }}>
                        Поздравляем! Желаем вам замечательного дня и много мурлыканья!
                    </Text>
                    <Text weight="regular" style={{ fontSize: 16, marginTop: 8}}>
                        {randomJoke}
                    </Text>
                </Div>
                <Div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: 16 }}>
                    <Button size="m" mode="secondary" onClick={downloadImage}>
                        <Icon20DownloadOutline />
                    </Button>
                    <CopyToClipboard text={catInfo} onCopy={showCopiedSnackbar}>
                        <Button size="m" mode="primary">
                            <Icon20CopyOutline />
                        </Button>
                    </CopyToClipboard>
                </Div>
            </Group>
            {snackbar}
            <div
                onClick={handleGifClick}
                style={{
                    position: 'fixed',
                    bottom: 10,
                    left: 10,
                    width: 50,
                    height: 50,
                    backgroundImage: `url('tenor.gif')`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    animation: 'wag 2s infinite',
                    cursor: 'pointer'
                }}
            />
            <style>{`
                @keyframes wag {
                    0% { transform: rotate(0deg); }
                    25% { transform: rotate(15deg); }
                    50% { transform: rotate(0deg); }
                    75% { transform: rotate(-15deg); }
                    100% { transform: rotate(0deg); }
                }
            `}</style>
        </Panel>
    );
};

export default RandomCat;
