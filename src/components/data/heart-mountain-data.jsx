
import CampResearchData from '../CampResearchData';

export default function HeartMountainData() {
    return (
        <CampResearchData
            campName="Heart Mountain"
            location="Park County, Wyoming, 13 miles northeast of Cody and 60 miles east of Yellowstone National Park."
            land="Bureau of Reclamation land."
            size="46,000 acres; the center was divided into two camps: North and South."
            peakPopulation="10,767"
            peakDate="October 30, 1942"
            openingDate="August 11, 1942"
            closingDates={{
                "North Camp": "October 15, 1945",
                "South Camp": "October 15, 1945"
            }}
            climate="High desert: summer temperatures reached 100 degrees. The average daily high temperatures for July, August, and September 1942 were 90.6, 85.0, and 79.7 degrees, respectively. Duststorms were a frequent problem here."
            populationOrigins={{
                "Los Angeles, CA": "5,952",
                "Fresno, CA": "2,972",
                "Santa Barbara, CA": "1,797",
                "San Joaquin, CA": "815",
                "Contra Costa and Ventura Counties, CA": "695"
            }}
            assemblyCenters={{
                "Turlock": "3,566",
                "Tulare": "4,951",
                "Santa Anita": "1,294",
                "Directly to Heart Mountain": "nearly 3,000",
                "Jerome": "2,000"
            }}
            administration={{
                projectDirectors: ["John J. McCloy", "Eastburn Smith", "Robert B. Cozzens", "L.H. Bennett", "Douglas M.Todd"],
                communityAnalysts: ["James H. Barnett", "G.Gordon Brown"],
                newspaper: "Heart Mountain Sentinel (October 24, 1942, to July 28, 1945)"
            }}
            statistics={{
                "% who answered question 28 of the loyalty questionnaire positively": "95.9%",
                "Number and percentage of eligible citizen males inducted directly into ARMED FORCES": "385 (4.8%)"
            }}
            industry="Heart Mountain had a garment factory, a cabinet shop and a sawmill that produced goods for internal consumption. A silk screen shop produced posters for the other camps and for the navy."
            history={[
                "The weather, along with the shoddy construction of the barracks and a population mostly from Southern California cities, unaccustomed to the cold, contributed to a great many illnesses that resulted in hospital overcrowding in the winter of 1942-43.",
                "In addition to the severe climate, Heart Mountain, like many other camps was plagued by duststorms and rattlesnakes.",
                "Despite the inhospitability of the area, Heart was to become one of the most successful camps in terms of agriculture; many crops that had never been grown in the area before were introduced.",
                "Heart Mountain residents were stung by a series of muckraking articles about the camp by Denver Post reporter Jack Carberry, alleging, among other things, that the inmate population was being 'coddled'.",
                "Heart Mountain was the site of the only organized resistance to the military draft. Beginning in February 1944, the FPC organized in Heart Mountain around the issue of drafting Nisei from the concentration camps for military service. Citing the Constitution, the members of the FPC stated that they would not report to the draft board if called upon until their rights as citizens were restored."
            ]}
            sources={[
                "Japanese American History: An A to Z Reference, 1868 to the Present, by Brian Niiya. New York: Facts on File, 1993. This information is provided with the permission from the Japanese American National Museum and Brian Niiya, 1997.",
                "Douglas W. Nelson, Heart Mountain: The History of an American Concentration Camp. (Madison, Wisconsin: The State Historical Society of Wisconsin, 1976.)",
                "Rita Takahashi Cates, 'Comparative Administration and Management of Five War Relocation Authority Camps: America's Incarceration of Persons of Japanese Descent during World War II.' (Dissertation, University of Pittsburgh, 1980. This work studies the administration strategies of Heart Mountain and four other camps.)",
                "Asael T. Hansen, 'My Two Years at Heart Mountain: The Difficult Role of an Applied Anthropologist.' (In Daniels, Roger, Sandra C.Taylor, and Harry H.L. Kitano, eds.) Japanese Americans: From Relocation to Redress. Revised Edition. Seattle: University of Washington Press, 1991. Pp 33-37 is a reminiscence by the former 'community analyst' at Heart Mountain)"
            ]}
        />
    );
}