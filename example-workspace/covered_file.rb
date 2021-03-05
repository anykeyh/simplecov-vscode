puts "hello"

def this_is_covered(x)
  if x % 2 == 1
    "This code is covered by test #{x}"
  else
    "This code is covered by test #{x}"
  end
end
        #  :nocov:
def this_wont_be_covered
  if true
    str = ""
    str << "this will be trigger but won't show in color as ignored in simplecov"
  end
end
#:nocov:

def this_is_half_covered
  str = ""
  x = true
  if x
    str << "this will be triggered"
  else
    str << "This will never trigger"
  end
end

def this_will_be_red
  puts "I never call this code"
end







