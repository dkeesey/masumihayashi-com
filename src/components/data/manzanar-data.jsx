
import CampResearchData from '../CampResearchData';

export default function ManzanarData() {
    return (
        <CampResearchData
            campName="Manzanar"
            location="Inyo County, California, 225 miles north of Los Angeles in the Owens Valley."
            land="City of Los Angeles land."
            size="6,200 acres; the center was divided into two camps: North and South."
            peakPopulation="10,046"
            peakDate="October 30, 1942"
            openingDate="March 21, 1942"
            closingDates={{
                "North Camp": "November 21, 1945",
                "South Camp": "November 21, 1945"
            }}
            climate="High desert: summer temperatures reached 100 degrees. The average daily high temperatures for July, August, and September 1942 were 90.6, 85.0, and 79.7 degrees, respectively. Duststorms were a frequent problem here."
            populationOrigins={{
                "Los Angeles, CA": "5,952",
                "Fresno, CA": "2,972",
                "Santa Barbara, CA": "1,797",
                "San Joaquin, CA": "815",
                "Contra Costa and Ventura Counties, CA": "695"
            }}
            administration={{
                projectDirectors: ["John J. McCloy", "Eastburn Smith", "Robert B. Cozzens", "L.H. Bennett", "Douglas M.Todd"],
                communityAnalysts: ["James H. Barnett", "G.Gordon Brown"],
                newspaper: "Manzanar News Courier (September 12, 1942 - September 5, 1945), Manzanar Bulletin (September 8 - 25, 1945)"
            }}
            statistics={{
                "% who answered question 28 of the loyalty questionnaire positively": "85.5%",
                "Number and percentage of eligible citizen males inducted directly into ARMED FORCES": "487 (6.0%)"
            }}
            industry="A camouflage net factory operated from Fall 1942, to May 1943; a model warship factory produced 900 models for the navy."
            history={[
                "Manzanar was on Pima Indian Reservation land. The WRA director Milton Eisenhower refused to relinquish administrative control of the camp to the Office of Indian Affairs, probably because of the potential for profitable agricultural enterprise here. Much of the administration staff at Manzanar came from OIA personnel.",
                "Manzanar had the most extensive agricultural program of all the camps. At its peak, Manzanar farmed approximately 8,000 acres, 4,000 in vegetable crops, some of which were shipped to other camps. Manzanar had 3,000 head of cattle, 3,500 hogs, 35,000 chickens, and 210 dairy cows. Fields of stocks and marigolds were also grown here for center consumption.",
                "Manzanar saw four project directors in its first eight months. The fourth, LH Bennett, remained director from December 12, 1942 to July 31, 1945.",
                "The camp was marred by inadequate housing, as people poured into a center which was not yet complete. As a result, Americans were housed in every conceivable space, in nearly constant 100 degree temperatures, until construction could be completed. Schools opened in October 1942 despite the almost total lack of supplies and furniture.",
                "On November 30, 1942, Takeo Tada was beaten by a group of men. He had been employed by both the Turlock 'Assembly Center' and Manzanar administrations and was targeted as an 'inu' (dog) by those angry over a delay in clothing allocations and at the administration in general. Hearings resulted in a 30 day jail sentance for the admitted perpetrator, amid a tense atmosphere where much of the camp population supported the attacker.",
                "Inadequate sanitation and sewage facilities coupled with the wind, dust, and heat, led to outbreaks of diarrhea, tuberculosis, 'Valley Fever', and other less serious disorders.",
                "When Eleanor Roosevelt was to visit one of the camps in the Spring of 1943, Manzanar was the one chosen, undoubtably because it had the best appearance."
            ]}
            source="Japanese American History: An A to Z Reference, 1868 to the Present, by Brian Niiya. New York: Facts on File, 1993. This information is provided with the permission from the Japanese American National Museum and Brian Niiya, 1997."
        />
    );
}