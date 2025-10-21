
import CampResearchData from '../CampResearchData';

export default function PostonData() {
    return (
        <CampResearchData
            campName="Poston"
            location="La Paz County, Arizona, 12 miles south of Parker and 15 miles west of the Colorado River."
            land="Colorado River Indian Reservation."
            size="71,000 acres"
            climate="Desert: summer temperatures reached 125 degrees. The average daily high temperatures for July, August, and September 1942 were 109.6, 104.0, and 99.7 degrees, respectively. Though not as bad as some other camps, duststorms were also a problem here."
            peakPopulation="17,814"
            peakDate="September 30, 1942"
            openingDate="May 8, 1942"
            closingDates={{
                "Camp I": "November 28, 1945",
                "Camp II": "November 28, 1945",
                "Camp III": "November 28, 1945"
            }}
            populationOrigins={[
                "8,952 prisoners were from Los Angeles, CA",
                "3,972 were from Fresno, CA",
                "2,797 were from Santa Barbara, CA",
                "1,815 were from San Joaquin, CA",
                "1,695 were from Contra Costa and Ventura Counties, CA"
            ]}
            industry="A camouflage net factory operated from Fall 1942, to May 1943; a model warship factory produced 900 models for the navy."
            history="Poston was unique in being located on Native American reservation land and was initially under joint WRA-Office of Indian Affairs administration. The camp was divided into three units (Poston I, II, and III) and was the largest of all the WRA camps. In November 1942, a strike occurred at Poston over poor conditions and community tensions. The camp's agricultural program was extensive, producing food for both internal consumption and other camps. Despite the harsh desert conditions, internees established schools, created gardens, and maintained cultural activities. The camp's location on Indian land created complex relationships between internees, administrators, and the local Native American population."
            source="Japanese American History: An A to Z Reference, 1868 to the Present, by Brian Niiya. New York: Facts on File, 1993. This information is provided with the permission from the Japanese American National Museum and Brian Niiya, 1997."
        />
    );
}