
import CampResearchData from '../CampResearchData';

export default function TopazData() {
    return (
        <CampResearchData
            campName="Topaz"
            location="Millard County, Utah, near Abraham, 140 miles south of Salt Lake City."
            land="Mix of public domain land, land which had reverted to the county for non payment of taxes and land purchased from private parties."
            size="19,800 acres"
            climate="Temperatures ranged from 106 degrees in summer to -30 degrees in winter; located at an elevation of 4,600 feet, the region was subject to a constant wind that resulted in frequent dust storms."
            populationOrigins={[
                "Primarily California:",
                "Alameda County County (3,679)",
                "San Francisco County (3,370)",
                "San Mateo County (722)"
            ]}
            additionalInfo={[
                "The population was almost completely urban in origin."
            ]}
            openingDate="September 11, 1942"
            peakPopulation="8,130"
            peakDate="March 17, 1943"
            closingDates="October 31, 1945"
            administration={{
                directors: "Charles F. Ernst and Luther T. Hoffman",
                communityAnalysts: "Oscar F. Hoffman and Weston LaBarre"
            }}
            newspaper="Topaz Times (September 17, 1942 to August 31, 1945)"
            loyaltyQuestionnaire="89.4%"
            armedForcesInduction="472 (7.3%)"
            history="Topaz featured an organized protest against the registration questionnaire, in which a petition was circulated demanding the restoration of rights as a prerequisite for registration. Issei chef James Hatsuki Wakasa was shot to death by a guard on April 11, 1943. The literary and arts magazine Trek was produced here."
            source="Japanese American History: An A to Z Reference, 1868 to the Present, by Brian Niiya. New York: Facts on File, 1993. This information is provided with the permission from the Japanese American National Museum and Brian Niiya, 1997."
            editedForExhibition="Edited for exhibition by Masumi Hayashi, 1994."
        />
    );
}