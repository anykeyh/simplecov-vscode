require "./spec_helpers"

require "./covered_file"

RSpec.describe "test-coverage" do
  it "cover code" do
    100.times { |x| this_is_covered(x) }

    # 10.times { this_is_half_covered }
    this_wont_be_covered
  end
end