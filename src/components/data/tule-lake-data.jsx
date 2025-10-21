
import CampResearchData from '../CampResearchData';

export default function TuleLakeData() {
    return (
        <CampResearchData
            campName="Tule Lake"
            location="Modoc County, California, 35 miles southeast of Klamath Falls, Oregon."
            land="Bureau of Reclamation land."
            size="7,400 acres, with a main firebreak area of 1,000 acres."
            peakPopulation="18,789"
            peakDate="December 25, 1944"
            openingDate="May 27, 1942"
            closingDates={{
                "Main Camp": "March 20, 1946"
            }}
            climate="High desert plateau at 4,000 feet elevation. Winters were cold with occasional snow. Summer temperatures could reach 100 degrees, but evenings were cool. The area was subject to strong winds and dust storms."
            populationOrigins={{
                "Sacramento, CA": "4,984",
                "King County, WA": "2,703",
                "Pierce County, WA": "1,052",
                "Placer County, CA": "967",
                "Other Northern California and Washington areas": "2,974"
            }}
            administration={{
                projectDirectors: ["Elmer L. Shirrell", "Harvey M. Coverley", "Raymond R. Best"],
                communityAnalysts: ["Marvin K. Opler", "John de Young"],
                newspaper: "Tulean Dispatch (June 15, 1942 - October 30, 1943), Newell Star (November 1, 1943 - March 1946)"
            }}
            statistics={{
                "% who answered question 28 of the loyalty questionnaire positively": "84.2%",
                "Number of segregees from other camps": "approximately 12,000"
            }}
            industry="The camp had extensive agricultural operations, producing food for its own consumption and for other camps. Industries included: a factory making wooden furniture and other items, a dehydration plant for vegetables, and various craft workshops."
            history={[
                "Tule Lake became a maximum security segregation center in 1943, designated to house those deemed 'disloyal' based on their answers to the controversial loyalty questionnaire.",
                "The camp was the largest and most controversial of the ten WRA camps, known for its resistance movements and civil disobedience.",
                "After segregation, the camp was surrounded by an additional fence and guard towers, and military police presence was increased.",
                "The camp experienced several strikes and protests, including a major incident in November 1943 that led to martial law being declared.",
                "Many of the segregees were kibei (American-born Japanese educated in Japan) who had answered 'no-no' to questions 27 and 28 on the loyalty questionnaire.",
                "The camp remained open the longest of all WRA camps, finally closing on March 20, 1946.",
                "Tule Lake's agricultural program was one of the most successful, with over 2,800 acres under cultivation."
            ]}
            sources={[
                "Japanese American History: An A to Z Reference, 1868 to the Present, by Brian Niiya. New York: Facts on File, 1993.",
                "Barbara Takei and Judy Tachibana, Tule Lake Revisited: A Brief History and Guide to the Tule Lake Concentration Camp Site (2001)",
                "Roger Daniels, Concentration Camps USA: Japanese Americans and World War II (1971)",
                "Dorothy S. Thomas and Richard S. Nishimoto, The Spoilage (1946)"
            ]}
        />
    );
}