export const getRiskStatus = (score: number) => {
    if (score <= 30) return { label: "Normal", color: "bg-green-100 text-green-700" };
    if (score <= 60) return { label: "Warning", color: "bg-yellow-100 text-yellow-700" };
    if (score <= 80) return {
        label: "High", color: "bg-orange-100 text-orange-700"
    };
    return { label: "Critical", color: "bg-red-100 text-red-700" };
};

