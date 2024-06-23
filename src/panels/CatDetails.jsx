import React, { useContext, useState, useEffect } from 'react';
import { Panel, PanelHeader, Group, Div, Text, PanelHeaderBack, Button, Snackbar } from '@vkontakte/vkui';
import {
    Icon16Done,
    Icon20CopyOutline,
    Icon20DownloadOutline
} from '@vkontakte/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { GlobalContext } from '../context';

const CatDetails = ({ id }) => {
    const { go } = useContext(GlobalContext);
    const { selectedCat, goBack } = useContext(GlobalContext);
    const [snackbar, setSnackbar] = useState(null);
    const [catInfo, setCatInfo] = useState('');

    if (!selectedCat) {
        return <Panel id={id}><PanelHeader before={<PanelHeaderBack onClick={goBack} />}>Информация о породе</PanelHeader><Div>Кошка не выбрана</Div></Panel>;
    }

    useEffect(() => {
        document.title = selectedCat.breed;
    }, [selectedCat]);

    const downloadImage = async () => {
        try {
            const response = await fetch(selectedCat.image);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${selectedCat.breed}.jpg`);
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
        } catch (error) {
            console.error('Failed to download image:', error);
        }
    };

    useEffect(() => {
        const info = `
            Порода: ${selectedCat.breed}
            Страна: ${selectedCat.country}
            Окраски: ${selectedCat.colors.join(', ')}
            Вес: ${selectedCat.weight}
            Средняя стоимость: ${selectedCat.price}
            Описание: ${selectedCat.description}
        `;
        setCatInfo(info.trim());
    }, [selectedCat]);


    const copyToClipboard = () => {
        navigator.clipboard.writeText(catInfo).then(() => {
            showCopiedSnackbar();
        }).catch(err => console.error('Failed to copy text: ', err));
    };

    const showCopiedSnackbar = () => {
        setSnackbar(
            <Snackbar
                onClose={() => setSnackbar(null)}
                duration="1500"
                before={<Icon16Done fill="var(--vkui--color_icon_positive)" />}
            >
                Результат скопирован в буфер обмена
            </Snackbar>
        );
    };

    return (
        <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={() => go('home')} />}>
                {selectedCat.breed}
            </PanelHeader>
            <Group>
                <Div style={{ padding: 0 }}>
                    <img
                        src={selectedCat.image}
                        alt={selectedCat.breed}
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '16px'
                        }}
                    />
                </Div>
                <Div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Text weight="semibold" style={{ marginTop: 16, fontSize: 18 }}>
                        {selectedCat.breed}
                    </Text>
                    <Text style={{ color: 'gray', marginTop: 8 }}>{selectedCat.country}</Text>
                </Div>
                <Div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Text weight="regular" style={{ fontSize: 16 }}>
                        <b>Окраски:</b> {selectedCat.colors.join(', ')}
                    </Text>
                    <Text weight="regular" style={{ fontSize: 16, marginTop: 8 }}>
                        <b>Вес:</b> {selectedCat.weight}
                    </Text>
                    <Text weight="regular" style={{ fontSize: 16, marginTop: 8 }}>
                        <b>Средняя стоимость:</b> {selectedCat.price}
                    </Text>
                    <Text weight="regular" style={{ fontSize: 16, marginTop: 16 }}>
                        {selectedCat.description}
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
        </Panel>
    );
};

export default CatDetails;
