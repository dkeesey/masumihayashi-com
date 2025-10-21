

import CampResearchData from '../CampResearchData';

export default function MinidokaData() {
    return (
        <CampResearchData
            campName="Minidoka"
            location="Jerome County, south central Idaho, 6 miles north of Eden."
            land="Federal reclamation project land, part of the Gooding Reclamation District."
            size="33,500 acres"
            climate="Severe, plagued by dust storms."
            populationOrigins={[
                "King County, WA (6,098)",
                "Multnomah County, OR (1,927)",
                "Pierce County, WA (1,051)"
            ]}
            additionalInfo={[
                "The population was from mostly urban areas."
            ]}
            openingDate="August 10, 1942"
            peakDate="March 1, 1943"
            peakPopulation="9,397"
            closingDates="October 28, 1945"
            administration={{
                directors: "Harry Stafford",
                analysts: "Gordon Armbruster, John de Young, and Elmer R. Smith",
                newspapers: "Minidoka Irrigator (September 10, 1942 to July 28, 1945)"
            }}
            statistics={{
                "% who answered question 28 of the loyalty questionnaire positively": "98.7%",
                "Number and percentage of eligible citizen males inducted directly into ARMED FORCES": "594 (8.8%)"
            }}
            industry="Minidoka had a garment factory which produced goods for internal consumption."
            history="Minidoka was regarded as the 'best' of the camps whose positive atmosphere stemmed from the relatively homogenous population and the relatively benevolent administration. Because it was not in the Western Defense Command restricted area, its security was lighter than that of other camps."
            source="Japanese American History: An A to Z Reference, 1868 to the Present, by Brian Niiya. New York: Facts on File, 1993. This information is provided with the permission from the Japanese American National Museum and Brian Niiya, 1997."
        />
    );
}