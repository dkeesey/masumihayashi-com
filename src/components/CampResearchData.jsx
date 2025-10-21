import { Fragment } from 'react';

export default function CampResearchData({ 
    campName,
    location,
    land,
    size,
    peakPopulation,
    peakDate,
    openingDate,
    closingDates,
    climate,
    populationOrigins,
    assemblyCenters,
    administration,
    statistics,
    industry,
    history,
    sources,
    description,
    additionalInfo,
    className
}) {
    return (
        <div className={`w-full mx-auto ${className}`}>
            <div className="p-8 sm:p-12 md:p-16 bg-[#f4f4ec] shadow-md border border-[#2c2c2c]/10 rounded-sm">
                <h3 className="font-typewriter text-2xl sm:text-3xl md:text-4xl mb-6 sm:mb-8 md:mb-12">
                    Research: {campName} Relocation Camp
                </h3>
                <div className="font-typewriter text-black space-y-4 sm:space-y-6 md:space-y-8 [&>*]:leading-relaxed text-base sm:text-lg">
                    {/* Basic Info Section */}
                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                        {location && (
                            <p><span className="font-typewriter uppercase">Location:</span> {location}</p>
                        )}
                        {land && (
                            <p><span className="font-typewriter uppercase">Land:</span> {land}</p>
                        )}
                        {size && (
                            <p><span className="font-typewriter uppercase">Size:</span> {size}</p>
                        )}
                    </div>

                    {/* Population Section */}
                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                        {peakPopulation && (
                            <p><span className="font-typewriter uppercase">Peak population:</span> {peakPopulation}</p>
                        )}
                        {peakDate && (
                            <p><span className="font-typewriter uppercase">Date of peak:</span> {peakDate}</p>
                        )}
                        {openingDate && (
                            <p><span className="font-typewriter uppercase">Opening date:</span> {openingDate}</p>
                        )}
                    </div>

                    {/* Closing Dates Section */}
                    {closingDates && (
                        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                            <p><span className="font-typewriter uppercase">Closing Dates:</span></p>
                            {typeof closingDates === 'string' ? (
                                <p className="ml-8">{closingDates}</p>
                            ) : (
                                Object.entries(closingDates).map(([camp, date]) => (
                                    <p key={camp} className="ml-8">
                                        <span className="font-typewriter uppercase">{camp}:</span> {date}
                                    </p>
                                ))
                            )}
                        </div>
                    )}

                    {/* Climate Section */}
                    {climate && (
                        <div className="mb-6 sm:mb-8">
                            <p><span className="font-typewriter uppercase">Climate:</span> {climate}</p>
                        </div>
                    )}

                    {/* Population Origins Section */}
                    {populationOrigins && (
                        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                            <p><span className="font-typewriter uppercase">Population Origins:</span></p>
                            <p className="ml-8">Of the {peakPopulation} Americans held prisoner here...</p>
                            <p className="ml-12 leading-relaxed">
                                {Object.entries(populationOrigins).map(([location, count], index) => (
                                    <Fragment key={location}>
                                        {count} prisoners were from {location}
                                        {index < Object.entries(populationOrigins).length - 1 && <br />}
                                    </Fragment>
                                ))}
                            </p>
                        </div>
                    )}

                    {/* Assembly Centers Section */}
                    {assemblyCenters && (
                        <div className="mb-6 sm:mb-8">
                            <p><span className="font-typewriter uppercase">Via "Assembly Centers":</span></p>
                            <p className="ml-8">
                                {typeof assemblyCenters === 'string' 
                                    ? assemblyCenters 
                                    : Object.entries(assemblyCenters).map(([center, count], index, arr) => (
                                        <span key={center}>
                                            {center} ({count})
                                            {index < arr.length - 1 && ', '}
                                        </span>
                                    ))
                                }
                            </p>
                        </div>
                    )}

                    {/* Administration Section */}
                    {administration && (
                        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                            {administration.projectDirectors && (
                                <p><span className="font-typewriter uppercase">Project Director(s):</span> {Array.isArray(administration.projectDirectors) ? administration.projectDirectors.join(', ') : administration.projectDirectors}</p>
                            )}
                            {administration.communityAnalysts && (
                                <p><span className="font-typewriter uppercase">Community Analysts:</span> {Array.isArray(administration.communityAnalysts) ? administration.communityAnalysts.join(' and ') : administration.communityAnalysts}</p>
                            )}
                            {administration.newspaper && (
                                <p><span className="font-typewriter uppercase">Newspaper(s):</span> <em>{administration.newspaper}</em></p>
                            )}
                        </div>
                    )}

                    {/* Statistics Section */}
                    {statistics && (
                        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                            {Object.entries(statistics).map(([stat, value]) => (
                                <p key={stat}><span className="font-typewriter uppercase">{stat}:</span> {value}</p>
                            ))}
                        </div>
                    )}

                    {/* Industry Section */}
                    {industry && (
                        <div className="mb-6 sm:mb-8">
                            <p><span className="font-typewriter uppercase">Industry:</span> {industry}</p>
                        </div>
                    )}

                    {/* History Section */}
                    {history && (
                        <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-6 sm:mb-8">
                            {Array.isArray(history) ? (
                                history.map((paragraph, index) => (
                                    <p key={index}>{index === 0 ? <><span className="font-typewriter uppercase">History: </span>{paragraph}</> : paragraph}</p>
                                ))
                            ) : (
                                <p><span className="font-typewriter uppercase">History:</span> {history}</p>
                            )}
                        </div>
                    )}

                    {/* Description Section */}
                    {description && (
                        <div className="mb-6 sm:mb-8">
                            <p>{description}</p>
                        </div>
                    )}

                    {/* Additional Info Section */}
                    {additionalInfo && (
                        <div className="mb-6 sm:mb-8">
                            {typeof additionalInfo === 'string' ? (
                                <p>{additionalInfo}</p>
                            ) : (
                                additionalInfo.map((info, index) => (
                                    <p key={index} className="mb-6">{info}</p>
                                ))
                            )}
                        </div>
                    )}

                    {/* Sources Section */}
                    {sources && (
                        <div className="space-y-4 sm:space-y-6 md:space-y-8">
                            {Array.isArray(sources) ? (
                                sources.map((source, index) => (
                                    <p key={index}>
                                        {index === 0 ? <span className="font-typewriter uppercase">Sources: </span> : ''}
                                        {source}
                                    </p>
                                ))
                            ) : (
                                <p><span className="font-typewriter uppercase">Sources:</span> {sources}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
