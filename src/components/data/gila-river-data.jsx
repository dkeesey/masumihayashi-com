
import CampResearchData from '../CampResearchData';

export default function GilaRiverData() {
    return (
        <CampResearchData
            campName="Gila River"
            location="Pinal County, Arizona, on the Gila River Indian Reservation."
            land="Leased from the Gila River Indian Community."
            size="16,500 acres total, with two separate camps: Canal Camp (3,000 acres) and Butte Camp (13,500 acres)."
            peakPopulation="13,348"
            peakDate="December 1942"
            openingDate="July 20, 1942"
            closingDates={{
                "Canal Camp": "September 28, 1945",
                "Butte Camp": "November 10, 1945"
            }}
            climate="Desert climate with extreme heat. Summer temperatures regularly exceeded 100 degrees, reaching as high as 125°F. Winters were mild. The area experienced frequent dust storms."
            populationOrigins={{
                "Los Angeles County, CA": "5,904",
                "Fresno County, CA": "1,963",
                "Sacramento County, CA": "2,321",
                "Tulare County, CA": "1,832",
                "Other California regions": "1,328"
            }}
            administration={{
                projectDirectors: ["Eastburn Smith", "L. H. Bennett", "Douglas M. Todd"],
                communityAnalysts: ["Robert F. Spencer", "James H. Barnett"],
                newspaper: "Gila News-Courier (September 1942 - January 1946)"
            }}
            statistics={{
                "% who answered question 28 of the loyalty questionnaire positively": "93.8%",
                "Number and percentage of eligible citizen males inducted into ARMED FORCES": "487 (4.2%)"
            }}
            industry="The camp had significant agricultural operations, producing vegetables and other crops. Industries included a camouflage net factory, garment factory, and various craft workshops. The camp was known for its successful cooperative enterprises."
            history={[
                "Gila River was unique in being located on Native American reservation land, leading to complex relationships between the WRA, the Office of Indian Affairs, and the Gila River Indian Community.",
                "The camp was considered one of the 'better' camps due to its relatively moderate climate and agricultural success.",
                "Gila River became known for its educational and recreational programs, including a high school that gained accreditation from the state of Arizona.",
                "The camp's baseball team, the Butte High Eagles, became legendary in the camp system, playing against teams from other camps and nearby communities.",
                "Despite being in the desert, inmates managed to create gardens and parks, including a 3-acre park with grass, trees, and a pond.",
                "The camp maintained good relations with the surrounding Native American community, with some tribal members working in the camp and inmates helping with reservation agricultural projects."
            ]}
            source="Japanese American History: An A to Z Reference, 1868 to the Present, by Brian Niiya. New York: Facts on File, 1993. This information is provided with the permission from the Japanese American National Museum and Brian Niiya, 1997."
        />
    );
}