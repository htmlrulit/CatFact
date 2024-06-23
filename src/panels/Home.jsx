import React, { useContext, useState, useEffect } from 'react';
import { Panel, PanelHeader, Header, Group, Cell, Search, List, Avatar, Div } from '@vkontakte/vkui';
import { Icon48StarsCircleFillViolet } from '@vkontakte/icons';
import { GlobalContext } from '../context';

const Home = ({ id }) => {
    const { cats, go, setSelectedCat } = useContext(GlobalContext);
    const [search, setSearch] = useState('');
    const [randomCat, setRandomCat] = useState(null);

    useEffect(() => {
        const savedCat = localStorage.getItem('randomCat');
        const savedDate = localStorage.getItem('randomCatDate');
        const today = new Date().toDateString();

        if (savedCat && savedDate === today) {
            setRandomCat(JSON.parse(savedCat));
        }
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        if (value.length <= 26) {
            setSearch(value);
        }
    };

    const showRandomCat = () => {
        const today = new Date().toDateString();
        if (!randomCat || localStorage.getItem('randomCatDate') !== today) {
            const randomIndex = Math.floor(Math.random() * cats.length);
            const randomCat = cats[randomIndex];
            localStorage.setItem('randomCat', JSON.stringify(randomCat));
            localStorage.setItem('randomCatDate', today);
            setRandomCat(randomCat);
        }
        setSelectedCat(randomCat);
        go('randomCat');
    };

    const getRelevanceScore = (cat, search) => {
        let score = 0;
        const searchLower = search.toLowerCase();
        const breedLower = cat.breed.toLowerCase();
        const countryLower = cat.country.toLowerCase();
        const descriptionLower = cat.description.toLowerCase();

        if (breedLower === searchLower) score += 10; // Full match with breed
        if (countryLower === searchLower) score += 8; // Full match with country
        if (descriptionLower === searchLower) score += 6; // Full match with description

        if (breedLower.startsWith(searchLower)) score += 5; // Partial match at start of breed
        if (countryLower.startsWith(searchLower)) score += 4; // Partial match at start of country
        if (descriptionLower.startsWith(searchLower)) score += 3; // Partial match at start of description

        if (breedLower.includes(searchLower)) score += 2; // Partial match anywhere in breed
        if (countryLower.includes(searchLower)) score += 1; // Partial match anywhere in country
        if (descriptionLower.includes(searchLower)) score += 1; // Partial match anywhere in description

        return score;
    };

    const filteredCats = cats
        .filter(cat =>
            cat.breed.toLowerCase().includes(search.toLowerCase()) ||
            cat.country.toLowerCase().includes(search.toLowerCase()) ||
            cat.description.toLowerCase().includes(search.toLowerCase())
        )
        .map(cat => ({ ...cat, relevance: getRelevanceScore(cat, search) }))
        .sort((a, b) => {
            if (search) {
                return b.relevance - a.relevance;
            } else {
                return a.breed.localeCompare(b.breed);
            }
        });

    return (
        <Panel id={id}>
            <PanelHeader>
                Всё о котах
            </PanelHeader>
            <Group header={<Header mode="secondary">Поиск</Header>}>
                <Search value={search} onChange={handleSearchChange} />
            </Group>
            <Group header={<Header mode="secondary">Породы кошек</Header>}>
                <List>
                    {!search && (
                        <Cell
                            before={<Avatar><Icon48StarsCircleFillViolet /></Avatar>}
                            expandable
                            description="Узнать, какая ты кошка сегодня"
                            onClick={showRandomCat}
                        >
                            Какая ты кошка сегодня?
                        </Cell>
                    )}
                    {filteredCats.length === 0 && (
                        <Div style={{ padding: '12px', textAlign: 'center', color: 'gray' }}>
                            Ничего не найдено
                        </Div>
                    )}
                    {filteredCats.map(cat => (
                        <Cell
                            key={cat.breed}
                            before={<Avatar src={cat.image} size={40} />}
                            expandable
                            description={cat.country}
                            onClick={() => {
                                setSelectedCat(cat);
                                go('catDetails');
                            }}
                        >
                            {cat.breed}
                        </Cell>
                    ))}
                </List>
            </Group>
        </Panel>
    );
};

export default Home;
