import os
import json
import time
import csv
import requests
from itertools import product
import matplotlib.pyplot as plt

# Optional: define reusable templates
TEMPLATES = {
    "default": """
    You are a policy analysis expert. Analyze the following {policy_area} policy scenario:

    POLICY PARAMETERS:
    {parameter_list}

    For this specific policy configuration, provide the following analysis:

    1. MOST LIKELY SCENARIO:
    Provide a realistic assessment if this policy were implemented. Include relevant impacts and public response.

    2. BEST-CASE SCENARIO:
    Describe the most positive possible outcome. What conditions would enable it?

    3. WORST-CASE SCENARIO:
    Describe the most negative possible outcome. What risk factors would lead to it?

    4. KEY FACTORS:
    List the 5 most important factors that would influence which scenario actually occurs.

    Format your response as JSON:
    ```json
    {{
        "most_likely_scenario": "description",
        "best_case_scenario": "description",
        "worst_case_scenario": "description",
        "key_factors": ["factor1", "factor2", "factor3", "factor4", "factor5"]
    }}
    ```
    Only provide the JSON.
    """
}

class PolicySimulator:
    def __init__(self, policy_area, template=None):
        self.policy_area = policy_area
        self.template = template or TEMPLATES["default"]
        self.results = []
        self.parameters = {}
        self.api_key = os.getenv("ANTHROPIC_API_KEY")

    def set_parameters(self, parameters):
        self.parameters = parameters

    def generate_prompt(self, params):
        param_strs = [f"- {k.replace('_', ' ').title()}: {v}" for k, v in params.items()]
        parameter_list = "\n".join(param_strs)
        return self.template.format(
            policy_area=self.policy_area.replace("_", " ").title(),
            parameter_list=parameter_list
        )

    def call_claude_api(self, prompt):
        headers = {
            "x-api-key": self.api_key,
            "content-type": "application/json",
            "anthropic-version": "2023-06-01"
        }
        data = {
            "model": "claude-3-opus-20240229",
            "max_tokens": 2000,
            "temperature": 0.2,
            "messages": [{"role": "user", "content": prompt}]
        }

        response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=data)

        if response.status_code != 200:
            raise Exception(f"API call failed: {response.status_code} - {response.text}")
        return response.json()

    def run_simulation(self, max_iterations=10):
        param_names = list(self.parameters.keys())
        param_values = list(self.parameters.values())
        combinations = list(product(*param_values))[:max_iterations]

        print(f"Running {len(combinations)} simulations...")

        for i, combo in enumerate(combinations):
            params = {param_names[j]: combo[j] for j in range(len(param_names))}
            prompt = self.generate_prompt(params)

            try:
                print(f"Simulation {i+1}/{len(combinations)}: {params}")
                response = self.call_claude_api(prompt)
                result_text = response["content"][0]["text"]

                if "```json" in result_text:
                    result_text = result_text.split("```json")[1].split("```")[0].strip()
                elif "```" in result_text:
                    result_text = result_text.split("```")[1].strip()

                result_json = json.loads(result_text)
                result_json.update(params)
                self.results.append(result_json)
                print(f"✅ Completed simulation {i+1}")
            except Exception as e:
                print(f"⚠️ Error in simulation {i+1}: {e}")

            time.sleep(1)

        return self.results

    def save_results(self, filename="results.json"):
        with open(filename, "w") as f:
            json.dump(self.results, f, indent=2)

    def save_results_csv(self, filename="results.csv"):
        if not self.results:
            print("⚠️ No results to save.")
            return

        param_keys = [k for k in self.results[0].keys() if k not in ["most_likely_scenario", "best_case_scenario", "worst_case_scenario", "key_factors"]]

        with open(filename, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(param_keys + ["scenario_type", "scenario_text", "key_factor"])

            for result in self.results:
                params = [result.get(k, "") for k in param_keys]
                writer.writerow(params + ["most_likely", result.get("most_likely_scenario", ""), ""])
                writer.writerow(params + ["best_case", result.get("best_case_scenario", ""), ""])
                writer.writerow(params + ["worst_case", result.get("worst_case_scenario", ""), ""])
                for factor in result.get("key_factors", []):
                    writer.writerow(params + ["key_factor", "", factor])

    def analyze_results(self):
        if not self.results:
            return "No results to analyze"

        all_factors = []
        for result in self.results:
            all_factors.extend(result.get("key_factors", []))

        factor_counts = {}
        for f in all_factors:
            factor_counts[f] = factor_counts.get(f, 0) + 1

        sorted_factors = sorted(factor_counts.items(), key=lambda x: x[1], reverse=True)
        return {"total_simulations": len(self.results), "top_factors": dict(sorted_factors[:10])}

    def visualize_top_factors(self, output_file="top_factors.png"):
        if not self.results:
            print("⚠️ No results to visualize.")
            return

        analysis = self.analyze_results()
        top_factors = analysis["top_factors"]

        plt.figure(figsize=(10, 6))
        plt.bar(top_factors.keys(), top_factors.values())
        plt.xticks(rotation=45, ha="right")
        plt.title(f"Top Factors in {self.policy_area.replace('_', ' ').title()} Simulations")
        plt.tight_layout()
        plt.savefig(output_file)
        plt.close()
        print(f"📊 Visualization saved to {output_file}")
